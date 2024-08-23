/*
Code generated by pkg/lib/bundle/generator. DO NOT EDIT.
source: pkg/lib/bundle/layouts.json
*/
package bundle

import "github.com/anyproto/anytype-heart/pkg/lib/pb/model"

const LayoutChecksum = "e725b47a91613b1e2fe962dcd35826142dec975c2603d66ffbac80d7332c1fa9"

var (
	Layouts = map[model.ObjectTypeLayout]model.Layout{
		model.ObjectType_basic: {

			Id:                model.ObjectType_basic,
			Name:              "Basic",
			RequiredRelations: []*model.Relation{relations[RelationKeyName]},
		},
		model.ObjectType_bookmark: {

			Id:   model.ObjectType_bookmark,
			Name: "Bookmark",
		},
		model.ObjectType_collection: {

			Id:                model.ObjectType_collection,
			Name:              "Collection",
			RequiredRelations: []*model.Relation{relations[RelationKeyName]},
		},
		model.ObjectType_dashboard: {

			Id:   model.ObjectType_dashboard,
			Name: "Dashboard",
		},
		model.ObjectType_file: {

			Id:   model.ObjectType_file,
			Name: "File",
		},
		model.ObjectType_image: {

			Id:                model.ObjectType_image,
			Name:              "Image",
			RequiredRelations: []*model.Relation{relations[RelationKeyIconImage]},
		},
		model.ObjectType_note: {

			Id:   model.ObjectType_note,
			Name: "Note",
		},
		model.ObjectType_objectType: {

			Id:                model.ObjectType_objectType,
			Name:              "Object Type",
			RequiredRelations: []*model.Relation{relations[RelationKeyName], relations[RelationKeyRecommendedRelations]},
		},
		model.ObjectType_participant: {

			Id:   model.ObjectType_participant,
			Name: "Participant",
		},
		model.ObjectType_profile: {

			Id:                model.ObjectType_profile,
			Name:              "Profile",
			RequiredRelations: []*model.Relation{relations[RelationKeyName]},
		},
		model.ObjectType_relation: {

			Id:   model.ObjectType_relation,
			Name: "Relation",
		},
		model.ObjectType_relationOption: {

			Id:                model.ObjectType_relationOption,
			Name:              "Relation Option",
			RequiredRelations: []*model.Relation{relations[RelationKeyName], relations[RelationKeyRelationOptionColor]},
		},
		model.ObjectType_set: {

			Id:                model.ObjectType_set,
			Name:              "Set",
			RequiredRelations: []*model.Relation{relations[RelationKeySetOf], relations[RelationKeyName]},
		},
		model.ObjectType_space: {

			Id:   model.ObjectType_space,
			Name: "Space",
		},
		model.ObjectType_spaceView: {

			Id:   model.ObjectType_spaceView,
			Name: "Space View",
		},
		model.ObjectType_todo: {

			Id:                model.ObjectType_todo,
			Name:              "to-do",
			RequiredRelations: []*model.Relation{relations[RelationKeyDone], relations[RelationKeyName]},
		},
	}
)
