package database

import (
	"time"

	"github.com/anyproto/anytype-heart/pkg/lib/pb/model"
	"github.com/anyproto/anytype-heart/util/pbtypes"
	timeutil "github.com/anyproto/anytype-heart/util/time"
)

func TransformQuickOption(protoFilters []*model.BlockContentDataviewFilter, loc *time.Location) []*model.BlockContentDataviewFilter {
	if protoFilters == nil {
		return nil
	}

	filters := make([]*model.BlockContentDataviewFilter, len(protoFilters))
	for i, f := range protoFilters {
		filters[i] = pbtypes.CopyFilter(f)
	}

	for _, f := range filters {
		if f.QuickOption > model.BlockContentDataviewFilter_ExactDate || f.Format == model.RelationFormat_date {
			d1, d2 := getRange(f, loc)
			switch f.Condition {
			case model.BlockContentDataviewFilter_Equal:
				f.Condition = model.BlockContentDataviewFilter_GreaterOrEqual
				f.Value = pbtypes.ToValue(d1)

				filters = append(filters, &model.BlockContentDataviewFilter{
					RelationKey: f.RelationKey,
					Condition:   model.BlockContentDataviewFilter_LessOrEqual,
					Value:       pbtypes.ToValue(d2),
				})
			case model.BlockContentDataviewFilter_Less:
				f.Value = pbtypes.ToValue(d1)
			case model.BlockContentDataviewFilter_Greater:
				f.Value = pbtypes.ToValue(d2)
			case model.BlockContentDataviewFilter_LessOrEqual:
				f.Value = pbtypes.ToValue(d2)
			case model.BlockContentDataviewFilter_GreaterOrEqual:
				f.Value = pbtypes.ToValue(d1)
			case model.BlockContentDataviewFilter_In:
				f.Condition = model.BlockContentDataviewFilter_GreaterOrEqual
				f.Value = pbtypes.ToValue(d1)

				filters = append(filters, &model.BlockContentDataviewFilter{
					RelationKey: f.RelationKey,
					Condition:   model.BlockContentDataviewFilter_LessOrEqual,
					Value:       pbtypes.ToValue(d2),
				})
			}
		}
	}

	return filters
}

func getRange(f *model.BlockContentDataviewFilter, loc *time.Location) (int64, int64) {
	var d1, d2 time.Time
	calendar := timeutil.NewCalendar(time.Now(), loc)
	switch f.QuickOption {
	case model.BlockContentDataviewFilter_Yesterday:
		d1 = calendar.DayNumStart(-1)
		d2 = calendar.DayNumEnd(-1)
	case model.BlockContentDataviewFilter_Today:
		d1 = calendar.DayNumStart(0)
		d2 = calendar.DayNumEnd(0)
	case model.BlockContentDataviewFilter_Tomorrow:
		d1 = calendar.DayNumStart(1)
		d2 = calendar.DayNumEnd(1)
	case model.BlockContentDataviewFilter_LastWeek:
		d1 = calendar.WeekNumStart(-1)
		d2 = calendar.WeekNumEnd(-1)
	case model.BlockContentDataviewFilter_CurrentWeek:
		d1 = calendar.WeekNumStart(0)
		d2 = calendar.WeekNumEnd(0)
	case model.BlockContentDataviewFilter_NextWeek:
		d1 = calendar.WeekNumStart(1)
		d2 = calendar.WeekNumEnd(1)
	case model.BlockContentDataviewFilter_LastMonth:
		d1 = calendar.MonthNumStart(-1)
		d2 = calendar.MonthNumEnd(-1)
	case model.BlockContentDataviewFilter_CurrentMonth:
		d1 = calendar.MonthNumStart(0)
		d2 = calendar.MonthNumEnd(0)
	case model.BlockContentDataviewFilter_NextMonth:
		d1 = calendar.MonthNumStart(1)
		d2 = calendar.MonthNumEnd(1)
	case model.BlockContentDataviewFilter_NumberOfDaysAgo:
		daysCnt := f.Value.GetNumberValue()
		d1 = calendar.DayNumStart(-int(daysCnt))
		d2 = calendar.DayNumEnd(-1)
	case model.BlockContentDataviewFilter_NumberOfDaysNow:
		daysCnt := f.Value.GetNumberValue()
		d1 = calendar.DayNumStart(0)
		d2 = calendar.DayNumEnd(int(daysCnt))
	case model.BlockContentDataviewFilter_ExactDate:
		timestamp := f.GetValue().GetNumberValue()
		t := time.Unix(int64(timestamp), 0)
		calendar2 := timeutil.NewCalendar(t, loc)
		d1 = calendar2.DayNumStart(0)
		d2 = calendar2.DayNumEnd(0)
	}

	return d1.Unix(), d2.Unix()
}
