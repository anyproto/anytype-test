package table

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/anyproto/anytype-heart/core/block/editor/state"
	"github.com/anyproto/anytype-heart/core/block/simple/base"
	"github.com/anyproto/anytype-heart/pkg/lib/pb/model"
)

func TestNormalize(t *testing.T) {
	for _, tc := range []struct {
		name   string
		source *state.State
		want   *state.State
	}{
		{
			name:   "empty",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, [][]string{}),
			want:   mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, [][]string{}),
		},
		{
			name: "invalid ids",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, [][]string{
				{"row1-c11", "row1-col2"},
				{"row2-col3"},
			}),
			want: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, [][]string{
				{"row1-col2"},
				{},
			}),
		},
		{
			name: "wrong column order",
			source: mkTestTable([]string{"col1", "col2", "col3"}, []string{"row1", "row2"}, [][]string{
				{"row1-col3", "row1-col1", "row1-col2"},
				{"row2-col3", "row2-c1", "row2-col1"},
			}),
			want: mkTestTable([]string{"col1", "col2", "col3"}, []string{"row1", "row2"}, [][]string{
				{"row1-col1", "row1-col2", "row1-col3"},
				{"row2-col1", "row2-col3"},
			}),
		},
		{
			name: "wrong place for header rows",
			source: mkTestTable([]string{"col1", "col2", "col3"}, []string{"row1", "row2", "row3"}, nil,
				withRowBlockContents(map[string]*model.BlockContentTableRow{
					"row3": {IsHeader: true},
				})),
			want: mkTestTable([]string{"col1", "col2", "col3"}, []string{"row3", "row1", "row2"}, nil,
				withRowBlockContents(map[string]*model.BlockContentTableRow{
					"row3": {IsHeader: true},
				})),
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			tb, err := NewTable(tc.source, "table")

			require.NoError(t, err)

			st := tc.source.Copy()
			err = tb.block.(Block).Normalize(st)
			require.NoError(t, err)

			assert.Equal(t, tc.want.Blocks(), st.Blocks())
		})
	}
}

func TestNormalizeAbsentRow(t *testing.T) {
	source := mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2", "row3"}, [][]string{
		{"row1-c11", "row1-col2"},
		{"row2-col3"},
	})
	source.CleanupBlock("row3")

	want := mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2", "row3"}, [][]string{
		{"row1-col2"},
		{},
		{},
	})

	tb, err := NewTable(source, "table")

	require.NoError(t, err)

	st := source.Copy()
	err = tb.block.(Block).Normalize(st)
	require.NoError(t, err)

	assert.Equal(t, want.Blocks(), st.Blocks())
}

func TestDuplicate(t *testing.T) {
	s := mkTestTable([]string{"col1", "col2", "col3"}, []string{"row1", "row2"},
		[][]string{
			{"row1-col1", "row1-col3"},
			{"row2-col1", "row2-col2"},
		}, withBlockContents(map[string]*model.Block{
			"row1-col1": mkTextBlock("11"),
			"row1-col3": mkTextBlock("13"),
			"row2-col1": mkTextBlock("21"),
			"row2-col2": mkTextBlock("22"),
		}))
	old, err := NewTable(s, "table")
	require.NoError(t, err)

	b := block{
		Base: base.NewBase(&model.Block{Id: "table"}).(*base.Base),
	}

	newId, visitedId, blocks, err := b.Duplicate(s)
	require.NoError(t, err)
	for _, b := range blocks {
		s.Add(b)
	}
	assert.ElementsMatch(t, []string{"table", "columns", "rows", "col1", "col2", "col3", "row1", "row2", "row1-col1", "row1-col3", "row2-col1", "row2-col2"}, visitedId)

	got, err := NewTable(s, newId)

	require.NoError(t, err)

	assertNotEqual := func(old, new *model.Block) {
		assert.NotEmpty(t, new.Id)
		assert.NotEqual(t, old.Id, new.Id)
		assert.Equal(t, len(old.ChildrenIds), len(new.ChildrenIds))
		assert.NotEqual(t, old.ChildrenIds, new.ChildrenIds)
	}
	assertNotEqual(old.block.Model(), got.block.Model())
	assertNotEqual(old.Columns(), got.Columns())
	assertNotEqual(old.Rows(), got.Rows())
	for i, oldID := range old.RowIDs() {
		newID := got.RowIDs()[i]

		oldRow := s.Pick(oldID)
		newRow := s.Pick(newID)

		assertNotEqual(oldRow.Model(), newRow.Model())
	}
}
