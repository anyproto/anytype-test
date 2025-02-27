// @generated by protobuf-ts 2.9.4 with parameter client_grpc1,optimize_code_size
// @generated from protobuf file "pkg/lib/pb/model/protos/localstore.proto" (package "anytype.model", syntax proto3)
// tslint:disable
import { MessageType } from "@protobuf-ts/runtime";
import { Relation } from "./models";
import { Struct } from "../../../../../google/protobuf/struct";
/**
 * @generated from protobuf message anytype.model.ObjectInfo
 */
export interface ObjectInfo {
    /**
     * @generated from protobuf field: string id = 1;
     */
    id: string;
    /**
     * @generated from protobuf field: repeated string objectTypeUrls = 2;
     */
    objectTypeUrls: string[]; // DEPRECATED
    /**
     * @generated from protobuf field: google.protobuf.Struct details = 3;
     */
    details?: Struct;
    /**
     * @generated from protobuf field: repeated anytype.model.Relation relations = 4;
     */
    relations: Relation[]; // DEPRECATED
    /**
     * @generated from protobuf field: string snippet = 5;
     */
    snippet: string;
    /**
     * @generated from protobuf field: bool hasInboundLinks = 6;
     */
    hasInboundLinks: boolean; // DEPRECATED
}
/**
 * @generated from protobuf message anytype.model.ObjectDetails
 */
export interface ObjectDetails {
    /**
     * @generated from protobuf field: google.protobuf.Struct details = 1;
     */
    details?: Struct;
}
/**
 * @generated from protobuf message anytype.model.ObjectLinks
 */
export interface ObjectLinks {
    /**
     * @generated from protobuf field: repeated string inboundIDs = 1;
     */
    inboundIDs: string[];
    /**
     * @generated from protobuf field: repeated string outboundIDs = 2;
     */
    outboundIDs: string[];
}
/**
 * @generated from protobuf message anytype.model.ObjectLinksInfo
 */
export interface ObjectLinksInfo {
    /**
     * @generated from protobuf field: repeated anytype.model.ObjectInfo inbound = 1;
     */
    inbound: ObjectInfo[];
    /**
     * @generated from protobuf field: repeated anytype.model.ObjectInfo outbound = 2;
     */
    outbound: ObjectInfo[];
}
/**
 * @generated from protobuf message anytype.model.ObjectInfoWithLinks
 */
export interface ObjectInfoWithLinks {
    /**
     * @generated from protobuf field: string id = 1;
     */
    id: string;
    /**
     * @generated from protobuf field: anytype.model.ObjectInfo info = 2;
     */
    info?: ObjectInfo;
    /**
     * @generated from protobuf field: anytype.model.ObjectLinksInfo links = 3;
     */
    links?: ObjectLinksInfo;
}
/**
 * @generated from protobuf message anytype.model.ObjectInfoWithOutboundLinks
 */
export interface ObjectInfoWithOutboundLinks {
    /**
     * @generated from protobuf field: string id = 1;
     */
    id: string;
    /**
     * @generated from protobuf field: anytype.model.ObjectInfo info = 2;
     */
    info?: ObjectInfo;
    /**
     * @generated from protobuf field: repeated anytype.model.ObjectInfo outboundLinks = 3;
     */
    outboundLinks: ObjectInfo[];
}
/**
 * @generated from protobuf message anytype.model.ObjectInfoWithOutboundLinksIDs
 */
export interface ObjectInfoWithOutboundLinksIDs {
    /**
     * @generated from protobuf field: string id = 1;
     */
    id: string;
    /**
     * @generated from protobuf field: anytype.model.ObjectInfo info = 2;
     */
    info?: ObjectInfo;
    /**
     * @generated from protobuf field: repeated string outboundLinks = 3;
     */
    outboundLinks: string[];
}
/**
 * @generated from protobuf message anytype.model.ObjectStoreChecksums
 */
export interface ObjectStoreChecksums {
    /**
     * @generated from protobuf field: string bundledObjectTypes = 1;
     */
    bundledObjectTypes: string;
    /**
     * @generated from protobuf field: string bundledRelations = 2;
     */
    bundledRelations: string;
    /**
     * @generated from protobuf field: string bundledLayouts = 3;
     */
    bundledLayouts: string;
    /**
     * @generated from protobuf field: int32 objectsForceReindexCounter = 4;
     */
    objectsForceReindexCounter: number; // increased in order to trigger all objects reindex
    /**
     * @generated from protobuf field: int32 filesForceReindexCounter = 5;
     */
    filesForceReindexCounter: number; // increased in order to fully reindex all objects
    /**
     * @generated from protobuf field: int32 idxRebuildCounter = 6;
     */
    idxRebuildCounter: number; // increased in order to remove indexes and reindex everything. Automatically triggers objects and files reindex(one time only)
    /**
     * @generated from protobuf field: int32 fulltextRebuild = 7;
     */
    fulltextRebuild: number; // DEPRECATED increased in order to perform fulltext indexing for all type of objects (useful when we change fulltext config)
    /**
     * @generated from protobuf field: int32 fulltextErase = 11;
     */
    fulltextErase: number; // DEPRECATED remove all the fulltext indexes and add to reindex queue after
    /**
     * @generated from protobuf field: string bundledTemplates = 8;
     */
    bundledTemplates: string;
    /**
     * @generated from protobuf field: int32 bundledObjects = 9;
     */
    bundledObjects: number; // anytypeProfile and maybe some others in the feature
    /**
     * @generated from protobuf field: int32 filestoreKeysForceReindexCounter = 10;
     */
    filestoreKeysForceReindexCounter: number;
    /**
     * @generated from protobuf field: bool areOldFilesRemoved = 12;
     */
    areOldFilesRemoved: boolean;
    /**
     * @generated from protobuf field: bool areDeletedObjectsReindexed = 13;
     */
    areDeletedObjectsReindexed: boolean; // DEPRECATED
    /**
     * @generated from protobuf field: int32 linksErase = 14;
     */
    linksErase: number;
    /**
     * @generated from protobuf field: int32 marketplaceForceReindexCounter = 15;
     */
    marketplaceForceReindexCounter: number;
    /**
     * @generated from protobuf field: int32 reindexDeletedObjects = 16;
     */
    reindexDeletedObjects: number;
}
// @generated message type with reflection information, may provide speed optimized methods
class ObjectInfo$Type extends MessageType<ObjectInfo> {
    constructor() {
        super("anytype.model.ObjectInfo", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "objectTypeUrls", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "details", kind: "message", T: () => Struct },
            { no: 4, name: "relations", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Relation },
            { no: 5, name: "snippet", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "hasInboundLinks", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.model.ObjectInfo
 */
export const ObjectInfo = new ObjectInfo$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ObjectDetails$Type extends MessageType<ObjectDetails> {
    constructor() {
        super("anytype.model.ObjectDetails", [
            { no: 1, name: "details", kind: "message", T: () => Struct }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.model.ObjectDetails
 */
export const ObjectDetails = new ObjectDetails$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ObjectLinks$Type extends MessageType<ObjectLinks> {
    constructor() {
        super("anytype.model.ObjectLinks", [
            { no: 1, name: "inboundIDs", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "outboundIDs", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.model.ObjectLinks
 */
export const ObjectLinks = new ObjectLinks$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ObjectLinksInfo$Type extends MessageType<ObjectLinksInfo> {
    constructor() {
        super("anytype.model.ObjectLinksInfo", [
            { no: 1, name: "inbound", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => ObjectInfo },
            { no: 2, name: "outbound", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => ObjectInfo }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.model.ObjectLinksInfo
 */
export const ObjectLinksInfo = new ObjectLinksInfo$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ObjectInfoWithLinks$Type extends MessageType<ObjectInfoWithLinks> {
    constructor() {
        super("anytype.model.ObjectInfoWithLinks", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "info", kind: "message", T: () => ObjectInfo },
            { no: 3, name: "links", kind: "message", T: () => ObjectLinksInfo }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.model.ObjectInfoWithLinks
 */
export const ObjectInfoWithLinks = new ObjectInfoWithLinks$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ObjectInfoWithOutboundLinks$Type extends MessageType<ObjectInfoWithOutboundLinks> {
    constructor() {
        super("anytype.model.ObjectInfoWithOutboundLinks", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "info", kind: "message", T: () => ObjectInfo },
            { no: 3, name: "outboundLinks", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => ObjectInfo }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.model.ObjectInfoWithOutboundLinks
 */
export const ObjectInfoWithOutboundLinks = new ObjectInfoWithOutboundLinks$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ObjectInfoWithOutboundLinksIDs$Type extends MessageType<ObjectInfoWithOutboundLinksIDs> {
    constructor() {
        super("anytype.model.ObjectInfoWithOutboundLinksIDs", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "info", kind: "message", T: () => ObjectInfo },
            { no: 3, name: "outboundLinks", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.model.ObjectInfoWithOutboundLinksIDs
 */
export const ObjectInfoWithOutboundLinksIDs = new ObjectInfoWithOutboundLinksIDs$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ObjectStoreChecksums$Type extends MessageType<ObjectStoreChecksums> {
    constructor() {
        super("anytype.model.ObjectStoreChecksums", [
            { no: 1, name: "bundledObjectTypes", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "bundledRelations", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "bundledLayouts", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "objectsForceReindexCounter", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 5, name: "filesForceReindexCounter", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 6, name: "idxRebuildCounter", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 7, name: "fulltextRebuild", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 11, name: "fulltextErase", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 8, name: "bundledTemplates", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "bundledObjects", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 10, name: "filestoreKeysForceReindexCounter", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 12, name: "areOldFilesRemoved", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 13, name: "areDeletedObjectsReindexed", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 14, name: "linksErase", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 15, name: "marketplaceForceReindexCounter", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 16, name: "reindexDeletedObjects", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.model.ObjectStoreChecksums
 */
export const ObjectStoreChecksums = new ObjectStoreChecksums$Type();
