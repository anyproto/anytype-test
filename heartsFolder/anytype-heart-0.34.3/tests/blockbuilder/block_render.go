package blockbuilder

import (
	"encoding/json"
	"fmt"

	"github.com/gogo/protobuf/jsonpb"
	"github.com/gogo/protobuf/proto"

	"github.com/anyproto/anytype-heart/pkg/lib/pb/model"
)

type blockView struct {
	Id              string
	Fields          *json.RawMessage         `json:"Fields,omitempty"`
	Children        []*Block                 `json:"Children,omitempty"`
	Restrictions    *model.BlockRestrictions `json:"Restrictions,omitempty"`
	BackgroundColor string                   `json:"BackgroundColor,omitempty"`
	Align           model.BlockAlign         `json:"Align,omitempty"`
	VerticalAlign   model.BlockVerticalAlign `json:"VerticalAlign,omitempty"`
	Content         *json.RawMessage         `json:"Content"`
}

func marshalProtoMessage(pbMessage proto.Message) (*json.RawMessage, error) {
	marshaller := &jsonpb.Marshaler{}
	raw, err := marshaller.MarshalToString(pbMessage)
	if err != nil {
		return nil, fmt.Errorf("marshal content: %w", err)
	}
	rawMessage := json.RawMessage(raw)
	return &rawMessage, nil
}

func (b *Block) MarshalJSON() ([]byte, error) {
	var (
		err        error
		rawContent *json.RawMessage
	)
	if content := b.block.Content; content != nil {
		contentWrapper := &model.Block{
			Content: content,
		}
		rawContent, err = marshalProtoMessage(contentWrapper)
		if err != nil {
			return nil, fmt.Errorf("marshal content: %w", err)
		}
	}
	var rawFields *json.RawMessage
	if fields := b.block.Fields; fields != nil {
		rawFields, err = marshalProtoMessage(b.block.Fields)
		if err != nil {
			return nil, fmt.Errorf("marshal fields: %w", err)
		}
	}

	v := blockView{
		Id:              b.block.Id,
		Fields:          rawFields,
		Children:        b.children,
		Restrictions:    b.block.Restrictions,
		BackgroundColor: b.block.BackgroundColor,
		Align:           b.block.Align,
		VerticalAlign:   b.block.VerticalAlign,
		Content:         rawContent,
	}
	return json.Marshal(v)
}
