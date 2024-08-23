package clipboard

import (
	"fmt"
	"strings"

	"github.com/anyproto/anytype-heart/core/block/editor/state"
	"github.com/anyproto/anytype-heart/core/block/editor/table"
	"github.com/anyproto/anytype-heart/core/block/simple"
	"github.com/anyproto/anytype-heart/core/block/simple/text"
	"github.com/anyproto/anytype-heart/pkg/lib/pb/model"
	"github.com/anyproto/anytype-heart/util/slice"
)

var pasteTargetCreator []func(b simple.Block) PasteTarget

type PasteTarget interface {
	PasteInside(targetState, clipboardState *state.State, secondBlock simple.Block) error
}

func resolvePasteTarget(b simple.Block) PasteTarget {
	for _, c := range pasteTargetCreator {
		if res := c(b); res != nil {
			return res
		}
	}
	return nil
}

func registerPasteTarget(c func(b simple.Block) PasteTarget) {
	pasteTargetCreator = append(pasteTargetCreator, c)
}

func init() {
	registerPasteTarget(newCellTarget)
}

func newCellTarget(b simple.Block) PasteTarget {
	if _, _, err := table.ParseCellID(b.Model().Id); err == nil {
		return &cellTarget{
			Block: b.Model(),
		}
	}
	return nil
}

type cellTarget struct {
	*model.Block
}

func (c *cellTarget) PasteInside(targetState, clipboardState *state.State, secondBlock simple.Block) error {
	b := targetState.Get(c.Id).(text.Block)

	var nonTextBlocks []simple.Block
	var textBlocks []text.Block

	textBlockIds := map[string]struct{}{}

	resolveBlockType := func(b simple.Block) {
		if b.Model().Id == clipboardState.RootId() {
			return
		}
		tb, ok := b.(text.Block)
		if ok {
			textBlocks = append(textBlocks, tb)
			textBlockIds[b.Model().Id] = struct{}{}
		} else {
			nonTextBlocks = append(nonTextBlocks, b)
		}
	}

	_ = clipboardState.Iterate(func(b simple.Block) (isContinue bool) {
		resolveBlockType(b)
		return true
	})
	resolveBlockType(secondBlock)

	for _, b := range nonTextBlocks {
		b.Model().ChildrenIds = slice.Filter(b.Model().ChildrenIds, func(id string) bool {
			_, ok := textBlockIds[id]
			return !ok
		})
	}

	var sep string
	if b.GetText() != "" {
		sep = "\n"
	}
	for _, tb := range textBlocks {
		marks := tb.Model().GetText().Marks
		txt := strings.TrimSpace(tb.GetText())

		tb.SetText(sep+txt, marks)
		tb.SetStyle(model.BlockContentText_Paragraph)
		if err := b.Merge(tb); err != nil {
			return fmt.Errorf("merge %s into %s: %w", tb.Model().Id, b.Model().Id, err)
		}

		sep = "\n"
	}

	tblock, err := table.NewTable(targetState, c.Id)
	if err != nil {
		return fmt.Errorf("init table: %w", err)
	}

	ids := make([]string, 0, len(nonTextBlocks))
	for _, b := range nonTextBlocks {
		targetState.Add(b)
		ids = append(ids, b.Model().Id)
	}
	roots := clipboardState.SelectRoots(ids)
	return targetState.InsertTo(tblock.Block().Model().Id, model.Block_Bottom, roots...)
}
