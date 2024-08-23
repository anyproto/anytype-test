package table

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/anyproto/anytype-heart/core/block/editor/smartblock/smarttest"
	"github.com/anyproto/anytype-heart/core/block/editor/state"
	"github.com/anyproto/anytype-heart/core/block/simple"
	"github.com/anyproto/anytype-heart/pb"
	"github.com/anyproto/anytype-heart/pkg/lib/pb/model"
)

func TestTableCreate(t *testing.T) {
	sb := smarttest.New("root")
	sb.AddBlock(simple.New(&model.Block{Id: "root"}))
	editor := NewEditor(sb)

	s := sb.NewState()
	id, err := editor.TableCreate(s, pb.RpcBlockTableCreateRequest{
		TargetId: "root",
		Position: model.Block_Inner,
		Columns:  3,
		Rows:     4,
	})

	require.NoError(t, err)
	assert.NotEmpty(t, id)

	tb, err := NewTable(s, id)

	require.NoError(t, err)

	assert.Len(t, tb.ColumnIDs(), 3)
	assert.Len(t, tb.RowIDs(), 4)

	for _, rowID := range tb.RowIDs() {
		row, err := pickRow(s, rowID)

		require.NoError(t, err)
		assert.Empty(t, row.Model().ChildrenIds)
	}
}

func TestRowCreate(t *testing.T) {
	for _, tc := range []struct {
		name     string
		source   *state.State
		newRowId string
		req      pb.RpcBlockTableRowCreateRequest
		want     *state.State
	}{
		{
			name:     "cells are not affected",
			source:   mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, [][]string{{"row1-col2"}}),
			newRowId: "row3",
			req: pb.RpcBlockTableRowCreateRequest{
				TargetId: "row1",
				Position: model.Block_Bottom,
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row3", "row2"}, [][]string{{"row1-col2"}}),
		},
		{
			name:     "between, bottom position",
			source:   mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, nil),
			newRowId: "row3",
			req: pb.RpcBlockTableRowCreateRequest{
				TargetId: "row1",
				Position: model.Block_Bottom,
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row3", "row2"}, nil),
		},
		{
			name:     "between, top position",
			source:   mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, nil),
			newRowId: "row3",
			req: pb.RpcBlockTableRowCreateRequest{
				TargetId: "row2",
				Position: model.Block_Top,
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row3", "row2"}, nil),
		},
		{
			name:     "at the beginning",
			source:   mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, nil),
			newRowId: "row3",
			req: pb.RpcBlockTableRowCreateRequest{
				TargetId: "row1",
				Position: model.Block_Top,
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row3", "row1", "row2"}, nil),
		},
		{
			name:     "at the end",
			source:   mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, nil),
			newRowId: "row3",
			req: pb.RpcBlockTableRowCreateRequest{
				TargetId: "row2",
				Position: model.Block_Bottom,
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2", "row3"}, nil),
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			tb := Editor{
				generateRowID: idFromSlice([]string{tc.newRowId}),
			}
			id, err := tb.RowCreate(tc.source, tc.req)
			require.NoError(t, err)
			assert.Equal(t, tc.newRowId, id)
			assert.Equal(t, tc.want.Blocks(), tc.source.Blocks())
		})
	}
}

func TestRowListClean(t *testing.T) {
	for _, tc := range []struct {
		name   string
		source *state.State
		req    pb.RpcBlockTableRowListCleanRequest
		want   *state.State
	}{
		{
			name: "empty rows",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, [][]string{
				{},
				{},
			}),
			req: pb.RpcBlockTableRowListCleanRequest{
				BlockIds: []string{"row1", "row2"},
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, [][]string{
				{},
				{},
			}),
		},
		{
			name: "rows with empty blocks",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, [][]string{
				{"row1-col1", "row1-col2"},
				{"row2-col2"},
			}),
			req: pb.RpcBlockTableRowListCleanRequest{
				BlockIds: []string{"row1", "row2"},
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, [][]string{
				{},
				{},
			}),
		},
		{
			name: "rows with not empty text block",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, [][]string{
				{"row1-col1", "row1-col2"},
				{"row2-col2"},
			}, withBlockContents(map[string]*model.Block{
				"row1-col1": mkTextBlock("test11"),
				"row2-col1": mkTextBlock(""),
			})),
			req: pb.RpcBlockTableRowListCleanRequest{
				BlockIds: []string{"row1", "row2"},
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, [][]string{
				{"row1-col1"},
				{},
			}, withBlockContents(map[string]*model.Block{
				"row1-col1": mkTextBlock("test11"),
			})),
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			tb := Editor{}
			err := tb.RowListClean(tc.source, tc.req)
			require.NoError(t, err)
			assert.Equal(t, tc.want.Blocks(), tc.source.Blocks())
		})
	}
}

func TestExpand(t *testing.T) {
	for _, tc := range []struct {
		name      string
		source    *state.State
		newColIds []string
		newRowIds []string
		req       pb.RpcBlockTableExpandRequest
		want      *state.State
	}{
		{
			name:      "only rows",
			source:    mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, [][]string{{"row2-col2"}}),
			newRowIds: []string{"row3", "row4"},
			req: pb.RpcBlockTableExpandRequest{
				TargetId: "table",
				Rows:     2,
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2", "row3", "row4"}, [][]string{{"row2-col2"}}),
		},
		{
			name:      "only columns",
			source:    mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, [][]string{{"row2-col2"}}),
			newColIds: []string{"col3", "col4"},
			req: pb.RpcBlockTableExpandRequest{
				TargetId: "table",
				Columns:  2,
			},
			want: mkTestTable([]string{"col1", "col2", "col3", "col4"}, []string{"row1", "row2"}, [][]string{{"row2-col2"}}),
		},
		{
			name:      "both columns and rows",
			source:    mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, [][]string{{"row2-col2"}}),
			newRowIds: []string{"row3", "row4"},
			newColIds: []string{"col3", "col4"},
			req: pb.RpcBlockTableExpandRequest{
				TargetId: "table",
				Rows:     2,
				Columns:  2,
			},
			want: mkTestTable([]string{"col1", "col2", "col3", "col4"}, []string{"row1", "row2", "row3", "row4"}, [][]string{{"row2-col2"}}),
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			tb := Editor{
				generateColID: idFromSlice(tc.newColIds),
				generateRowID: idFromSlice(tc.newRowIds),
			}
			err := tb.Expand(tc.source, tc.req)
			require.NoError(t, err)
			assert.Equal(t, tc.want.Blocks(), tc.source.Blocks())
		})
	}
}

func TestRowListFill(t *testing.T) {
	for _, tc := range []struct {
		name   string
		source *state.State
		req    pb.RpcBlockTableRowListFillRequest
		want   *state.State
	}{
		{
			name:   "empty",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, [][]string{}),
			req: pb.RpcBlockTableRowListFillRequest{
				BlockIds: []string{"row1", "row2"},
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"},
				[][]string{
					{"row1-col1", "row1-col2"},
					{"row2-col1", "row2-col2"},
				}),
		},
		{
			name: "fully filled",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"},
				[][]string{
					{"row1-col1", "row1-col2"},
					{"row2-col1", "row2-col2"},
				}),
			req: pb.RpcBlockTableRowListFillRequest{
				BlockIds: []string{"row1", "row2"},
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"},
				[][]string{
					{"row1-col1", "row1-col2"},
					{"row2-col1", "row2-col2"},
				}),
		},
		{
			name: "partially filled",
			source: mkTestTable([]string{"col1", "col2", "col3"}, []string{"row1", "row2", "row3", "row4", "row5"},
				[][]string{
					{"row1-col1"},
					{"row2-col2"},
					{"row3-col3"},
					{"row4-col1", "row4-col3"},
					{"row5-col2", "row4-col3"},
				}),
			req: pb.RpcBlockTableRowListFillRequest{
				BlockIds: []string{"row1", "row2", "row3", "row4", "row5"},
			},
			want: mkTestTable([]string{"col1", "col2", "col3"}, []string{"row1", "row2", "row3", "row4", "row5"},
				[][]string{
					{"row1-col1", "row1-col2", "row1-col3"},
					{"row2-col1", "row2-col2", "row2-col3"},
					{"row3-col1", "row3-col2", "row3-col3"},
					{"row4-col1", "row4-col2", "row4-col3"},
					{"row5-col1", "row5-col2", "row5-col3"},
				}),
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			tb := Editor{}
			err := tb.RowListFill(tc.source, tc.req)
			require.NoError(t, err)
			assert.Equal(t, tc.want.Blocks(), tc.source.Blocks())
		})
	}
}

func TestColumnListFill(t *testing.T) {
	for _, tc := range []struct {
		name   string
		source *state.State
		req    pb.RpcBlockTableColumnListFillRequest
		want   *state.State
	}{
		{
			name:   "empty",
			source: mkTestTable([]string{"col1", "col2", "col3"}, []string{"row1", "row2"}, [][]string{}),
			req: pb.RpcBlockTableColumnListFillRequest{
				BlockIds: []string{"col2", "col1"},
			},
			want: mkTestTable([]string{"col1", "col2", "col3"}, []string{"row1", "row2"},
				[][]string{
					{"row1-col1", "row1-col2"},
					{"row2-col1", "row2-col2"},
				}),
		},
		{
			name: "fully filled",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"},
				[][]string{
					{"row1-col1", "row1-col2"},
					{"row2-col1", "row2-col2"},
				}),
			req: pb.RpcBlockTableColumnListFillRequest{
				BlockIds: []string{"col2", "col1"},
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"},
				[][]string{
					{"row1-col1", "row1-col2"},
					{"row2-col1", "row2-col2"},
				}),
		},
		{
			name: "partially filled",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2", "row3"}, [][]string{
				{"row1-col1"},
				{"row2-col2"},
				{"row3-col1", "row3-col2"},
			}),
			req: pb.RpcBlockTableColumnListFillRequest{
				BlockIds: []string{"col1", "col2"},
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2", "row3"}, [][]string{
				{"row1-col1", "row1-col2"},
				{"row2-col1", "row2-col2"},
				{"row3-col1", "row3-col2"},
			}),
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			tb := Editor{}
			err := tb.ColumnListFill(tc.source, tc.req)
			require.NoError(t, err)
			assert.Equal(t, tc.want.Blocks(), tc.source.Blocks())
		})
	}
}

func TestColumnCreate(t *testing.T) {
	for _, tc := range []struct {
		name     string
		source   *state.State
		newColId string
		req      pb.RpcBlockTableColumnCreateRequest
		want     *state.State
	}{
		{
			name:     "between, to the right",
			source:   mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, [][]string{{"row1-col2"}}),
			newColId: "col3",
			req: pb.RpcBlockTableColumnCreateRequest{
				TargetId: "col1",
				Position: model.Block_Right,
			},
			want: mkTestTable([]string{"col1", "col3", "col2"}, []string{"row1", "row2"}, [][]string{{"row1-col2"}}),
		},
		{
			name:     "between, to the left",
			source:   mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, [][]string{{"row1-col2"}}),
			newColId: "col3",
			req: pb.RpcBlockTableColumnCreateRequest{
				TargetId: "col2",
				Position: model.Block_Left,
			},
			want: mkTestTable([]string{"col1", "col3", "col2"}, []string{"row1", "row2"}, [][]string{{"row1-col2"}}),
		},
		{
			name:     "at the beginning",
			source:   mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, [][]string{{"row1-col2"}}),
			newColId: "col3",
			req: pb.RpcBlockTableColumnCreateRequest{
				TargetId: "col1",
				Position: model.Block_Left,
			},
			want: mkTestTable([]string{"col3", "col1", "col2"}, []string{"row1", "row2"}, [][]string{{"row1-col2"}}),
		},
		{
			name:     "at the end",
			source:   mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"}, [][]string{{"row1-col2"}}),
			newColId: "col3",
			req: pb.RpcBlockTableColumnCreateRequest{
				TargetId: "col2",
				Position: model.Block_Right,
			},
			want: mkTestTable([]string{"col1", "col2", "col3"}, []string{"row1", "row2"}, [][]string{{"row1-col2"}}),
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			tb := Editor{
				generateColID: idFromSlice([]string{tc.newColId}),
			}
			id, err := tb.ColumnCreate(tc.source, tc.req)
			require.NoError(t, err)
			assert.Equal(t, tc.newColId, id)
			assert.Equal(t, tc.want.Blocks(), tc.source.Blocks())
		})
	}
}

func TestColumnDuplicate(t *testing.T) {
	for _, tc := range []struct {
		name     string
		source   *state.State
		newColId string
		req      pb.RpcBlockTableColumnDuplicateRequest
		want     *state.State
	}{
		{
			name: "fully filled",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"},
				[][]string{
					{"row1-col1", "row1-col2"},
					{"row2-col1", "row2-col2"},
				}, withBlockContents(map[string]*model.Block{
					"row1-col1": mkTextBlock("test11"),
					"row2-col1": mkTextBlock("test21"),
				})),
			newColId: "col3",
			req: pb.RpcBlockTableColumnDuplicateRequest{
				BlockId:  "col1",
				TargetId: "col2",
				Position: model.Block_Right,
			},
			want: mkTestTable([]string{"col1", "col2", "col3"}, []string{"row1", "row2"},
				[][]string{
					{"row1-col1", "row1-col2", "row1-col3"},
					{"row2-col1", "row2-col2", "row2-col3"},
				}, withBlockContents(map[string]*model.Block{
					"row1-col1": mkTextBlock("test11"),
					"row2-col1": mkTextBlock("test21"),
					"row1-col3": mkTextBlock("test11"),
					"row2-col3": mkTextBlock("test21"),
				})),
		},
		{
			name: "partially filled",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2", "row3"},
				[][]string{
					{"row1-col1"},
					{"row2-col2"},
					{},
				}, withBlockContents(map[string]*model.Block{
					"row2-col2": mkTextBlock("test22"),
				})),
			newColId: "col3",
			req: pb.RpcBlockTableColumnDuplicateRequest{
				BlockId:  "col2",
				TargetId: "col1",
				Position: model.Block_Left,
			},
			want: mkTestTable([]string{"col3", "col1", "col2"}, []string{"row1", "row2", "row3"},
				[][]string{
					{"row1-col1"},
					{"row2-col3", "row2-col2"},
					{},
				}, withBlockContents(map[string]*model.Block{
					"row2-col2": mkTextBlock("test22"),
					"row2-col3": mkTextBlock("test22"),
				})),
		},
		{
			name: "empty",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2", "row3"},
				[][]string{
					{"row1-col1"},
					{},
					{},
				}),
			newColId: "col3",
			req: pb.RpcBlockTableColumnDuplicateRequest{
				BlockId:  "col2",
				TargetId: "col1",
				Position: model.Block_Left,
			},
			want: mkTestTable([]string{"col3", "col1", "col2"}, []string{"row1", "row2", "row3"},
				[][]string{
					{"row1-col1"},
					{},
					{},
				}),
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			tb := Editor{
				generateColID: idFromSlice([]string{tc.newColId}),
			}
			id, err := tb.ColumnDuplicate(tc.source, tc.req)
			require.NoError(t, err)
			assert.Equal(t, tc.want.Blocks(), tc.source.Blocks())
			assert.Equal(t, tc.newColId, id)
		})
	}
}

func TestRowDuplicate(t *testing.T) {
	for _, tc := range []struct {
		name     string
		source   *state.State
		newRowId string
		req      pb.RpcBlockTableRowDuplicateRequest
		want     *state.State
	}{
		{
			name: "fully filled",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"},
				[][]string{
					{"row1-col1", "row1-col2"},
					{"row2-col1", "row2-col2"},
				}, withBlockContents(map[string]*model.Block{
					"row1-col1": mkTextBlock("test11"),
					"row1-col2": mkTextBlock("test12"),
					"row2-col1": mkTextBlock("test21"),
				})),
			newRowId: "row3",
			req: pb.RpcBlockTableRowDuplicateRequest{
				BlockId:  "row1",
				TargetId: "row2",
				Position: model.Block_Bottom,
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2", "row3"},
				[][]string{
					{"row1-col1", "row1-col2"},
					{"row2-col1", "row2-col2"},
					{"row3-col1", "row3-col2"},
				}, withBlockContents(map[string]*model.Block{
					"row1-col1": mkTextBlock("test11"),
					"row1-col2": mkTextBlock("test12"),
					"row2-col1": mkTextBlock("test21"),
					"row3-col1": mkTextBlock("test11"),
					"row3-col2": mkTextBlock("test12"),
				})),
		},
		{
			name: "partially filled",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"},
				[][]string{
					{"row1-col1"},
					{"row2-col2"},
				}, withBlockContents(map[string]*model.Block{
					"row1-col1": mkTextBlock("test11"),
					"row2-col2": mkTextBlock("test22"),
				})),
			newRowId: "row3",
			req: pb.RpcBlockTableRowDuplicateRequest{
				BlockId:  "row2",
				TargetId: "row1",
				Position: model.Block_Top,
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row3", "row1", "row2"},
				[][]string{
					{"row3-col2"},
					{"row1-col1"},
					{"row2-col2"},
				}, withBlockContents(map[string]*model.Block{
					"row1-col1": mkTextBlock("test11"),
					"row2-col2": mkTextBlock("test22"),
					"row3-col2": mkTextBlock("test22"),
				})),
		},
		{
			name: "empty",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"},
				[][]string{
					{},
					{},
				}),
			newRowId: "row3",
			req: pb.RpcBlockTableRowDuplicateRequest{
				BlockId:  "row2",
				TargetId: "row1",
				Position: model.Block_Bottom,
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row3", "row2"},
				[][]string{
					{},
					{},
					{},
				}),
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			tb := Editor{
				generateRowID: idFromSlice([]string{tc.newRowId}),
			}
			id, err := tb.RowDuplicate(tc.source, tc.req)
			require.NoError(t, err)
			assert.Equal(t, tc.newRowId, id)
			assert.Equal(t, tc.want.Blocks(), tc.source.Blocks())
		})
	}
}

func TestColumnMove(t *testing.T) {
	for _, tc := range []struct {
		name   string
		source *state.State
		req    pb.RpcBlockTableColumnMoveRequest
		want   *state.State
	}{
		{
			name: "partial table",
			source: mkTestTable([]string{"col1", "col2", "col3"}, []string{"row1", "row2"},
				[][]string{
					{"row1-col1", "row1-col2", "row1-col3"},
					{"row2-col1", "row2-col3"},
				}),
			req: pb.RpcBlockTableColumnMoveRequest{
				TargetId:     "col1",
				DropTargetId: "col3",
				Position:     model.Block_Left,
			},
			want: mkTestTable([]string{"col2", "col1", "col3"}, []string{"row1", "row2"},
				[][]string{
					{"row1-col2", "row1-col1", "row1-col3"},
					{"row2-col1", "row2-col3"},
				}),
		},
		{
			name: "filled table",
			source: mkTestTable([]string{"col1", "col2", "col3"}, []string{"row1", "row2"},
				[][]string{
					{"row1-col1", "row1-col2", "row1-col3"},
					{"row2-col1", "row2-col2", "row2-col3"},
				}),
			req: pb.RpcBlockTableColumnMoveRequest{
				TargetId:     "col3",
				DropTargetId: "col1",
				Position:     model.Block_Right,
			},
			want: mkTestTable([]string{"col1", "col3", "col2"}, []string{"row1", "row2"},
				[][]string{
					{"row1-col1", "row1-col3", "row1-col2"},
					{"row2-col1", "row2-col3", "row2-col2"},
				}),
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			tb := Editor{}
			err := tb.ColumnMove(tc.source, tc.req)
			require.NoError(t, err)
			assert.Equal(t, tc.want.Blocks(), tc.source.Blocks())
		})
	}
}

func TestColumnDelete(t *testing.T) {
	for _, tc := range []struct {
		name   string
		source *state.State
		req    pb.RpcBlockTableColumnDeleteRequest
		want   *state.State
	}{
		{
			name: "partial table",
			source: mkTestTable([]string{"col1", "col2", "col3"}, []string{"row1", "row2"},
				[][]string{
					{"row1-col1", "row1-col2", "row1-col3"},
					{"row2-col1", "row2-col3"},
				}),
			req: pb.RpcBlockTableColumnDeleteRequest{
				TargetId: "col2",
			},
			want: mkTestTable([]string{"col1", "col3"}, []string{"row1", "row2"},
				[][]string{
					{"row1-col1", "row1-col3"},
					{"row2-col1", "row2-col3"},
				}),
		},
		{
			name: "filled table",
			source: mkTestTable([]string{"col1", "col2", "col3"}, []string{"row1", "row2"},
				[][]string{
					{"row1-col1", "row1-col2", "row1-col3"},
					{"row2-col1", "row2-col2", "row2-col3"},
				}),
			req: pb.RpcBlockTableColumnDeleteRequest{
				TargetId: "col3",
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2"},
				[][]string{
					{"row1-col1", "row1-col2"},
					{"row2-col1", "row2-col2"},
				}),
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			tb := Editor{}
			err := tb.ColumnDelete(tc.source, tc.req)
			require.NoError(t, err)
			assert.Equal(t, tc.want.Blocks(), tc.source.Blocks())
		})
	}
}

func TestSort(t *testing.T) {
	for _, tc := range []struct {
		name   string
		source *state.State
		req    pb.RpcBlockTableSortRequest
		want   *state.State
	}{
		{
			name: "asc order",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2", "row3"},
				[][]string{
					{"row1-col1", "row1-col2"},
					{"row2-col1", "row2-col2"},
					{"row3-col1", "row3-col2"},
				}, withBlockContents(map[string]*model.Block{
					"row1-col2": mkTextBlock("Abd"),
					"row2-col2": mkTextBlock("bsd"),
					"row3-col2": mkTextBlock("abc"),
				})),
			req: pb.RpcBlockTableSortRequest{
				ColumnId: "col2",
				Type:     model.BlockContentDataviewSort_Asc,
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row3", "row1", "row2"},
				[][]string{
					{"row1-col1", "row1-col2"},
					{"row2-col1", "row2-col2"},
					{"row3-col1", "row3-col2"},
				}, withBlockContents(map[string]*model.Block{
					"row3-col2": mkTextBlock("abc"),
					"row1-col2": mkTextBlock("Abd"),
					"row2-col2": mkTextBlock("bsd"),
				})),
		},
		{
			name: "desc order",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2", "row3"},
				[][]string{
					{"row1-col1", "row1-col2"},
					{"row2-col1", "row2-col2"},
					{"row3-col1", "row3-col2"},
				}, withBlockContents(map[string]*model.Block{
					"row1-col2": mkTextBlock("234"),
					"row2-col2": mkTextBlock("323"),
					"row3-col2": mkTextBlock("123"),
				})),
			req: pb.RpcBlockTableSortRequest{
				ColumnId: "col2",
				Type:     model.BlockContentDataviewSort_Desc,
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row2", "row1", "row3"},
				[][]string{
					{"row1-col1", "row1-col2"},
					{"row2-col1", "row2-col2"},
					{"row3-col1", "row3-col2"},
				}, withBlockContents(map[string]*model.Block{
					"row1-col2": mkTextBlock("234"),
					"row2-col2": mkTextBlock("323"),
					"row3-col2": mkTextBlock("123"),
				})),
		},
		{
			name: "asc order with header rows",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2", "row3", "row4", "row5"},
				[][]string{
					{"row1-col1", "row1-col2"},
					{"row2-col1", "row2-col2"},
					{"row3-col1", "row3-col2"},
					{"row4-col1", "row4-col2"},
					{"row5-col1", "row5-col2"},
				}, withBlockContents(map[string]*model.Block{
					"row1-col2": mkTextBlock("555"),
					"row2-col2": mkTextBlock("444"),
					"row3-col2": mkTextBlock("333"),
					"row4-col2": mkTextBlock("222"),
					"row5-col2": mkTextBlock("111"),
				}),
				withRowBlockContents(map[string]*model.BlockContentTableRow{
					"row1": {IsHeader: true},
					"row3": {IsHeader: true},
				})),
			req: pb.RpcBlockTableSortRequest{
				ColumnId: "col2",
				Type:     model.BlockContentDataviewSort_Asc,
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row3", "row5", "row4", "row2"},
				[][]string{
					{"row1-col1", "row1-col2"},
					{"row3-col1", "row3-col2"},
					{"row5-col1", "row5-col2"},
					{"row4-col1", "row4-col2"},
					{"row2-col1", "row2-col2"},
				}, withBlockContents(map[string]*model.Block{
					"row1-col2": mkTextBlock("555"),
					"row2-col2": mkTextBlock("444"),
					"row3-col2": mkTextBlock("333"),
					"row4-col2": mkTextBlock("222"),
					"row5-col2": mkTextBlock("111"),
				}),
				withRowBlockContents(map[string]*model.BlockContentTableRow{
					"row1": {IsHeader: true},
					"row3": {IsHeader: true},
				})),
		},
		{
			name: "desc order with header rows",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2", "row3", "row4", "row5"},
				[][]string{
					{"row1-col1", "row1-col2"},
					{"row2-col1", "row2-col2"},
					{"row3-col1", "row3-col2"},
					{"row4-col1", "row4-col2"},
					{"row5-col1", "row5-col2"},
				}, withBlockContents(map[string]*model.Block{
					"row1-col2": mkTextBlock("555"),
					"row2-col2": mkTextBlock("444"),
					"row3-col2": mkTextBlock("333"),
					"row4-col2": mkTextBlock("222"),
					"row5-col2": mkTextBlock("111"),
				}),
				withRowBlockContents(map[string]*model.BlockContentTableRow{
					"row1": {IsHeader: true},
					"row3": {IsHeader: true},
				})),
			req: pb.RpcBlockTableSortRequest{
				ColumnId: "col2",
				Type:     model.BlockContentDataviewSort_Desc,
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row3", "row2", "row4", "row5"},
				[][]string{
					{"row1-col1", "row1-col2"},
					{"row3-col1", "row3-col2"},
					{"row2-col1", "row2-col2"},
					{"row4-col1", "row4-col2"},
					{"row5-col1", "row5-col2"},
				}, withBlockContents(map[string]*model.Block{
					"row1-col2": mkTextBlock("555"),
					"row2-col2": mkTextBlock("444"),
					"row3-col2": mkTextBlock("333"),
					"row4-col2": mkTextBlock("222"),
					"row5-col2": mkTextBlock("111"),
				}),
				withRowBlockContents(map[string]*model.BlockContentTableRow{
					"row1": {IsHeader: true},
					"row3": {IsHeader: true},
				})),
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			tb := Editor{}
			err := tb.Sort(tc.source, tc.req)
			require.NoError(t, err)
			assert.Equal(t, tc.want.Blocks(), tc.source.Blocks())
		})
	}
}

func TestRowSetHeader(t *testing.T) {
	for _, tc := range []struct {
		name   string
		source *state.State
		req    pb.RpcBlockTableRowSetHeaderRequest
		want   *state.State
	}{
		{
			name:   "header row moves up",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row1", "row2", "row3", "row4"}, nil),
			req: pb.RpcBlockTableRowSetHeaderRequest{
				TargetId: "row3",
				IsHeader: true,
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row3", "row1", "row2", "row4"}, nil,
				withRowBlockContents(map[string]*model.BlockContentTableRow{
					"row3": {IsHeader: true},
				})),
		},
		{
			name: "non-header row moves down",
			source: mkTestTable([]string{"col1", "col2"}, []string{"row2", "row3", "row1", "row4"}, nil,
				withRowBlockContents(map[string]*model.BlockContentTableRow{
					"row2": {IsHeader: true},
					"row3": {IsHeader: true},
				})),
			req: pb.RpcBlockTableRowSetHeaderRequest{
				TargetId: "row2",
				IsHeader: false,
			},
			want: mkTestTable([]string{"col1", "col2"}, []string{"row3", "row2", "row1", "row4"}, nil,
				withRowBlockContents(map[string]*model.BlockContentTableRow{
					"row3": {IsHeader: true},
				})),
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			tb := Editor{}
			err := tb.RowSetHeader(tc.source, tc.req)
			require.NoError(t, err)
			assert.Equal(t, tc.want.Blocks(), tc.source.Blocks())
		})
	}
}

func TestEditorAPI(t *testing.T) {
	rawTable := [][]string{
		{"c11", "c12", "c13"},
		{"c21", "c22", "c23"},
	}

	s := state.NewDoc("root", map[string]simple.Block{
		"root": simple.New(&model.Block{
			Content: &model.BlockContentOfSmartblock{
				Smartblock: &model.BlockContentSmartblock{},
			},
		}),
	}).(*state.State)

	ed := NewEditor(nil)
	ed.generateColID = idFromSlice([]string{"col1", "col2", "col3"})
	ed.generateRowID = idFromSlice([]string{"row1", "row2"})

	tableID, err := ed.TableCreate(s, pb.RpcBlockTableCreateRequest{
		TargetId: "root",
		Position: model.Block_Inner,
	})
	require.NoError(t, err)

	err = ed.Expand(s, pb.RpcBlockTableExpandRequest{
		TargetId: tableID,
		Columns:  3,
	})
	require.NoError(t, err)

	tb, err := NewTable(s, tableID)
	require.NoError(t, err)

	columnIDs := tb.ColumnIDs()
	for _, row := range rawTable {
		rowID, err := ed.RowCreate(s, pb.RpcBlockTableRowCreateRequest{
			TargetId: tableID,
			Position: model.Block_Inner,
		})
		require.NoError(t, err)

		for colIdx, cellTxt := range row {
			colID := columnIDs[colIdx]

			_, err := ed.CellCreate(s, rowID, colID, &model.Block{
				Content: &model.BlockContentOfText{
					Text: &model.BlockContentText{
						Text: cellTxt,
					},
				},
			})
			require.NoError(t, err)
		}
	}

	want := mkTestTable([]string{"col1", "col2", "col3"}, []string{"row1", "row2"},
		[][]string{
			{"row1-col1", "row1-col2", "row1-col3"},
			{"row2-col1", "row2-col2", "row2-col3"},
		}, withBlockContents(map[string]*model.Block{
			"row1-col1": mkTextBlock("c11"),
			"row1-col2": mkTextBlock("c12"),
			"row1-col3": mkTextBlock("c13"),
			"row2-col1": mkTextBlock("c21"),
			"row2-col2": mkTextBlock("c22"),
			"row2-col3": mkTextBlock("c23"),
		}))

	filter := func(bs []*model.Block) []*model.Block {
		var res []*model.Block
		for _, b := range bs {
			if b.GetTableRow() != nil || b.GetTableColumn() != nil || b.GetText() != nil {
				res = append(res, b)
			}
		}
		return res
	}
	assert.Equal(t, filter(want.Blocks()), filter(s.Blocks()))
}

type testTableOptions struct {
	blocks map[string]*model.Block

	rowBlocks map[string]*model.BlockContentTableRow
}

type testTableOption func(o *testTableOptions)

func withBlockContents(blocks map[string]*model.Block) testTableOption {
	return func(o *testTableOptions) {
		o.blocks = blocks
	}
}

func withRowBlockContents(blocks map[string]*model.BlockContentTableRow) testTableOption {
	return func(o *testTableOptions) {
		o.rowBlocks = blocks
	}
}

func mkTestTable(columns []string, rows []string, cells [][]string, opts ...testTableOption) *state.State {
	o := testTableOptions{}
	for _, apply := range opts {
		apply(&o)
	}

	s := state.NewDoc("root", nil).NewState()
	blocks := []*model.Block{
		{
			Id:          "root",
			ChildrenIds: []string{"table"},
		},
		{
			Id:          "table",
			ChildrenIds: []string{"columns", "rows"},
			Content:     &model.BlockContentOfTable{Table: &model.BlockContentTable{}},
		},
		{
			Id:          "columns",
			ChildrenIds: columns,
			Content: &model.BlockContentOfLayout{
				Layout: &model.BlockContentLayout{
					Style: model.BlockContentLayout_TableColumns,
				},
			},
		},
		{
			Id:          "rows",
			ChildrenIds: rows,
			Content: &model.BlockContentOfLayout{
				Layout: &model.BlockContentLayout{
					Style: model.BlockContentLayout_TableRows,
				},
			},
		},
	}

	for _, c := range columns {
		blocks = append(blocks, &model.Block{
			Id:      c,
			Content: &model.BlockContentOfTableColumn{TableColumn: &model.BlockContentTableColumn{}},
		})
	}

	cellsByRow := map[string][]string{}
	for _, cc := range cells {
		if len(cc) == 0 {
			continue
		}
		rowID, _, err := ParseCellID(cc[0])
		if err != nil {
			panic(err)
		}
		cellsByRow[rowID] = cc

		for _, c := range cc {
			proto, ok := o.blocks[c]
			if !ok {
				proto = &model.Block{
					Content: &model.BlockContentOfText{Text: &model.BlockContentText{}},
				}
			}
			proto.Id = c
			blocks = append(blocks, proto)
		}
	}

	for _, r := range rows {
		content := &model.BlockContentOfTableRow{TableRow: &model.BlockContentTableRow{}}
		if c, ok := o.rowBlocks[r]; ok {
			content.TableRow = c
		}
		blocks = append(blocks, &model.Block{
			Id:          r,
			ChildrenIds: cellsByRow[r],
			Content:     content,
		})
	}

	for _, b := range blocks {
		s.Add(simple.New(b))
	}
	return s
}

func mkTextBlock(txt string) *model.Block {
	return &model.Block{
		Content: &model.BlockContentOfText{Text: &model.BlockContentText{
			Text: txt,
		}},
	}
}

func idFromSlice(ids []string) func() string {
	var i int
	return func() string {
		id := ids[i]
		i++
		return id
	}
}
