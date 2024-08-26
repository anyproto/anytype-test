// @generated by protobuf-ts 2.9.4 with parameter client_grpc1,optimize_code_size
// @generated from protobuf file "pb/protos/changes.proto" (package "anytype", syntax proto3)
// tslint:disable
import { MessageType } from "@protobuf-ts/runtime";
import { DeviceInfo } from "../../pkg/lib/pb/model/protos/models";
import { Notification_Status } from "../../pkg/lib/pb/model/protos/models";
import { Notification } from "../../pkg/lib/pb/model/protos/models";
import { FileInfo } from "../../pkg/lib/pb/model/protos/models";
import { RelationLink } from "../../pkg/lib/pb/model/protos/models";
import { Value } from "../../google/protobuf/struct";
import { Event_Message } from "./events";
import { Block } from "../../pkg/lib/pb/model/protos/models";
import { Block_Position } from "../../pkg/lib/pb/model/protos/models";
import { SmartBlockSnapshotBase } from "../../pkg/lib/pb/model/protos/models";
/**
 * the element of change tree used to store and internal apply smartBlock history
 *
 * @generated from protobuf message anytype.Change
 */
export interface Change {
    /**
     * ids of previous changes
     *
     * @generated from protobuf field: repeated string previous_ids = 1;
     */
    previousIds: string[];
    /**
     * id of the last snapshot
     *
     * @generated from protobuf field: string last_snapshot_id = 2;
     */
    lastSnapshotId: string;
    /**
     * ids of the last changes with details/relations content
     *
     * @generated from protobuf field: repeated string previous_meta_ids = 5;
     */
    previousMetaIds: string[];
    /**
     * set of actions to apply
     *
     * @generated from protobuf field: repeated anytype.Change.Content content = 3;
     */
    content: Change_Content[];
    /**
     * snapshot - when not null, the Content will be ignored
     *
     * @generated from protobuf field: anytype.Change.Snapshot snapshot = 4;
     */
    snapshot?: Change_Snapshot;
    /**
     * file keys related to changes content
     *
     * @generated from protobuf field: repeated anytype.Change.FileKeys fileKeys = 6;
     */
    fileKeys: Change_FileKeys[];
    /**
     * creation timestamp
     *
     * @generated from protobuf field: int64 timestamp = 7;
     */
    timestamp: bigint;
    /**
     * version of business logic
     *
     * @generated from protobuf field: uint32 version = 8;
     */
    version: number;
}
/**
 * @generated from protobuf message anytype.Change.Snapshot
 */
export interface Change_Snapshot {
    /**
     * logId -> lastChangeId
     *
     * @generated from protobuf field: map<string, string> logHeads = 1;
     */
    logHeads: {
        [key: string]: string;
    };
    /**
     * snapshot data
     *
     * @generated from protobuf field: anytype.model.SmartBlockSnapshotBase data = 2;
     */
    data?: SmartBlockSnapshotBase;
    /**
     * all file keys related to doc
     *
     * @generated from protobuf field: repeated anytype.Change.FileKeys fileKeys = 3;
     */
    fileKeys: Change_FileKeys[];
}
/**
 * @generated from protobuf message anytype.Change.FileKeys
 */
export interface Change_FileKeys {
    /**
     * @generated from protobuf field: string hash = 1;
     */
    hash: string;
    /**
     * @generated from protobuf field: map<string, string> keys = 2;
     */
    keys: {
        [key: string]: string;
    };
}
/**
 * @generated from protobuf message anytype.Change.Content
 */
export interface Change_Content {
    /**
     * @generated from protobuf oneof: value
     */
    value: {
        oneofKind: "blockCreate";
        /**
         * @generated from protobuf field: anytype.Change.BlockCreate blockCreate = 1;
         */
        blockCreate: Change_BlockCreate;
    } | {
        oneofKind: "blockUpdate";
        /**
         * @generated from protobuf field: anytype.Change.BlockUpdate blockUpdate = 2;
         */
        blockUpdate: Change_BlockUpdate;
    } | {
        oneofKind: "blockRemove";
        /**
         * @generated from protobuf field: anytype.Change.BlockRemove blockRemove = 3;
         */
        blockRemove: Change_BlockRemove;
    } | {
        oneofKind: "blockMove";
        /**
         * @generated from protobuf field: anytype.Change.BlockMove blockMove = 4;
         */
        blockMove: Change_BlockMove;
    } | {
        oneofKind: "blockDuplicate";
        /**
         * @generated from protobuf field: anytype.Change.BlockDuplicate blockDuplicate = 5;
         */
        blockDuplicate: Change_BlockDuplicate;
    } | {
        oneofKind: "relationAdd";
        /**
         * @generated from protobuf field: anytype.Change.RelationAdd relationAdd = 50;
         */
        relationAdd: Change_RelationAdd;
    } | {
        oneofKind: "relationRemove";
        /**
         * @generated from protobuf field: anytype.Change.RelationRemove relationRemove = 51;
         */
        relationRemove: Change_RelationRemove;
    } | {
        oneofKind: "detailsSet";
        /**
         * @generated from protobuf field: anytype.Change.DetailsSet detailsSet = 100;
         */
        detailsSet: Change_DetailsSet;
    } | {
        oneofKind: "detailsUnset";
        /**
         * @generated from protobuf field: anytype.Change.DetailsUnset detailsUnset = 101;
         */
        detailsUnset: Change_DetailsUnset;
    } | {
        oneofKind: "objectTypeAdd";
        /**
         * @generated from protobuf field: anytype.Change.ObjectTypeAdd objectTypeAdd = 105;
         */
        objectTypeAdd: Change_ObjectTypeAdd;
    } | {
        oneofKind: "objectTypeRemove";
        /**
         * @generated from protobuf field: anytype.Change.ObjectTypeRemove objectTypeRemove = 106;
         */
        objectTypeRemove: Change_ObjectTypeRemove;
    } | {
        oneofKind: "storeKeySet";
        /**
         * @generated from protobuf field: anytype.Change.StoreKeySet storeKeySet = 107;
         */
        storeKeySet: Change_StoreKeySet;
    } | {
        oneofKind: "storeKeyUnset";
        /**
         * @generated from protobuf field: anytype.Change.StoreKeyUnset storeKeyUnset = 108;
         */
        storeKeyUnset: Change_StoreKeyUnset;
    } | {
        oneofKind: "storeSliceUpdate";
        /**
         * @generated from protobuf field: anytype.Change.StoreSliceUpdate storeSliceUpdate = 109;
         */
        storeSliceUpdate: Change_StoreSliceUpdate;
    } | {
        oneofKind: "originalCreatedTimestampSet";
        /**
         * @generated from protobuf field: anytype.Change.OriginalCreatedTimestampSet originalCreatedTimestampSet = 110;
         */
        originalCreatedTimestampSet: Change_OriginalCreatedTimestampSet;
    } | {
        oneofKind: "setFileInfo";
        /**
         * @generated from protobuf field: anytype.Change.SetFileInfo setFileInfo = 111;
         */
        setFileInfo: Change_SetFileInfo;
    } | {
        oneofKind: "notificationCreate";
        /**
         * @generated from protobuf field: anytype.Change.NotificationCreate notificationCreate = 112;
         */
        notificationCreate: Change_NotificationCreate;
    } | {
        oneofKind: "notificationUpdate";
        /**
         * @generated from protobuf field: anytype.Change.NotificationUpdate notificationUpdate = 113;
         */
        notificationUpdate: Change_NotificationUpdate;
    } | {
        oneofKind: "deviceAdd";
        /**
         * @generated from protobuf field: anytype.Change.DeviceAdd deviceAdd = 114;
         */
        deviceAdd: Change_DeviceAdd;
    } | {
        oneofKind: "deviceUpdate";
        /**
         * @generated from protobuf field: anytype.Change.DeviceUpdate deviceUpdate = 115;
         */
        deviceUpdate: Change_DeviceUpdate;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message anytype.Change.BlockCreate
 */
export interface Change_BlockCreate {
    /**
     * @generated from protobuf field: string targetId = 1;
     */
    targetId: string;
    /**
     * @generated from protobuf field: anytype.model.Block.Position position = 2;
     */
    position: Block_Position;
    /**
     * @generated from protobuf field: repeated anytype.model.Block blocks = 3;
     */
    blocks: Block[];
}
/**
 * @generated from protobuf message anytype.Change.BlockUpdate
 */
export interface Change_BlockUpdate {
    /**
     * @generated from protobuf field: repeated anytype.Event.Message events = 2;
     */
    events: Event_Message[];
}
/**
 * @generated from protobuf message anytype.Change.BlockRemove
 */
export interface Change_BlockRemove {
    /**
     * @generated from protobuf field: repeated string ids = 1;
     */
    ids: string[];
}
/**
 * @generated from protobuf message anytype.Change.BlockMove
 */
export interface Change_BlockMove {
    /**
     * @generated from protobuf field: string targetId = 1;
     */
    targetId: string;
    /**
     * @generated from protobuf field: anytype.model.Block.Position position = 2;
     */
    position: Block_Position;
    /**
     * @generated from protobuf field: repeated string ids = 3;
     */
    ids: string[];
}
/**
 * @generated from protobuf message anytype.Change.BlockDuplicate
 */
export interface Change_BlockDuplicate {
    /**
     * @generated from protobuf field: string targetId = 1;
     */
    targetId: string;
    /**
     * @generated from protobuf field: anytype.model.Block.Position position = 2;
     */
    position: Block_Position;
    /**
     * @generated from protobuf field: repeated string ids = 3;
     */
    ids: string[];
}
/**
 * @generated from protobuf message anytype.Change.DetailsSet
 */
export interface Change_DetailsSet {
    /**
     * @generated from protobuf field: string key = 1;
     */
    key: string;
    /**
     * @generated from protobuf field: google.protobuf.Value value = 2;
     */
    value?: Value;
}
/**
 * @generated from protobuf message anytype.Change.DetailsUnset
 */
export interface Change_DetailsUnset {
    /**
     * @generated from protobuf field: string key = 1;
     */
    key: string;
}
/**
 * @generated from protobuf message anytype.Change.RelationAdd
 */
export interface Change_RelationAdd {
    /**
     * @generated from protobuf field: repeated anytype.model.RelationLink relationLinks = 1;
     */
    relationLinks: RelationLink[];
}
/**
 * @generated from protobuf message anytype.Change.RelationRemove
 */
export interface Change_RelationRemove {
    /**
     * @generated from protobuf field: repeated string relationKey = 1;
     */
    relationKey: string[];
}
/**
 * @generated from protobuf message anytype.Change.ObjectTypeAdd
 */
export interface Change_ObjectTypeAdd {
    /**
     * @generated from protobuf field: string url = 1;
     */
    url: string;
    /**
     * @generated from protobuf field: string key = 2;
     */
    key: string;
}
/**
 * @generated from protobuf message anytype.Change.ObjectTypeRemove
 */
export interface Change_ObjectTypeRemove {
    /**
     * @generated from protobuf field: string url = 1;
     */
    url: string;
    /**
     * @generated from protobuf field: string key = 2;
     */
    key: string;
}
/**
 * @generated from protobuf message anytype.Change.StoreKeySet
 */
export interface Change_StoreKeySet {
    /**
     * @generated from protobuf field: repeated string path = 1;
     */
    path: string[];
    /**
     * @generated from protobuf field: google.protobuf.Value value = 2;
     */
    value?: Value;
}
/**
 * @generated from protobuf message anytype.Change.StoreKeyUnset
 */
export interface Change_StoreKeyUnset {
    /**
     * @generated from protobuf field: repeated string path = 1;
     */
    path: string[];
}
/**
 * @generated from protobuf message anytype.Change.StoreSliceUpdate
 */
export interface Change_StoreSliceUpdate {
    /**
     * @generated from protobuf field: string key = 1;
     */
    key: string;
    /**
     * @generated from protobuf oneof: operation
     */
    operation: {
        oneofKind: "add";
        /**
         * @generated from protobuf field: anytype.Change.StoreSliceUpdate.Add add = 2;
         */
        add: Change_StoreSliceUpdate_Add;
    } | {
        oneofKind: "remove";
        /**
         * @generated from protobuf field: anytype.Change.StoreSliceUpdate.Remove remove = 3;
         */
        remove: Change_StoreSliceUpdate_Remove;
    } | {
        oneofKind: "move";
        /**
         * @generated from protobuf field: anytype.Change.StoreSliceUpdate.Move move = 4;
         */
        move: Change_StoreSliceUpdate_Move;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message anytype.Change.StoreSliceUpdate.Add
 */
export interface Change_StoreSliceUpdate_Add {
    /**
     * @generated from protobuf field: string afterId = 1;
     */
    afterId: string;
    /**
     * @generated from protobuf field: repeated string ids = 2;
     */
    ids: string[];
}
/**
 * @generated from protobuf message anytype.Change.StoreSliceUpdate.Remove
 */
export interface Change_StoreSliceUpdate_Remove {
    /**
     * @generated from protobuf field: repeated string ids = 1;
     */
    ids: string[];
}
/**
 * @generated from protobuf message anytype.Change.StoreSliceUpdate.Move
 */
export interface Change_StoreSliceUpdate_Move {
    /**
     * @generated from protobuf field: string afterId = 1;
     */
    afterId: string;
    /**
     * @generated from protobuf field: repeated string ids = 2;
     */
    ids: string[];
}
/**
 * @generated from protobuf message anytype.Change.OriginalCreatedTimestampSet
 */
export interface Change_OriginalCreatedTimestampSet {
    /**
     * @generated from protobuf field: int64 ts = 1;
     */
    ts: bigint;
}
/**
 * @generated from protobuf message anytype.Change.SetFileInfo
 */
export interface Change_SetFileInfo {
    /**
     * @generated from protobuf field: anytype.model.FileInfo fileInfo = 1;
     */
    fileInfo?: FileInfo;
}
/**
 * @generated from protobuf message anytype.Change.NotificationCreate
 */
export interface Change_NotificationCreate {
    /**
     * @generated from protobuf field: anytype.model.Notification notification = 1;
     */
    notification?: Notification;
}
/**
 * @generated from protobuf message anytype.Change.NotificationUpdate
 */
export interface Change_NotificationUpdate {
    /**
     * @generated from protobuf field: string id = 1;
     */
    id: string;
    /**
     * @generated from protobuf field: anytype.model.Notification.Status status = 2;
     */
    status: Notification_Status;
}
/**
 * @generated from protobuf message anytype.Change.DeviceAdd
 */
export interface Change_DeviceAdd {
    /**
     * @generated from protobuf field: anytype.model.DeviceInfo device = 1;
     */
    device?: DeviceInfo;
}
/**
 * @generated from protobuf message anytype.Change.DeviceUpdate
 */
export interface Change_DeviceUpdate {
    /**
     * @generated from protobuf field: string id = 1;
     */
    id: string;
    /**
     * @generated from protobuf field: string name = 2;
     */
    name: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class Change$Type extends MessageType<Change> {
    constructor() {
        super("anytype.Change", [
            { no: 1, name: "previous_ids", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "last_snapshot_id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "previous_meta_ids", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "content", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Change_Content },
            { no: 4, name: "snapshot", kind: "message", T: () => Change_Snapshot },
            { no: 6, name: "fileKeys", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Change_FileKeys },
            { no: 7, name: "timestamp", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 8, name: "version", kind: "scalar", T: 13 /*ScalarType.UINT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change
 */
export const Change = new Change$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_Snapshot$Type extends MessageType<Change_Snapshot> {
    constructor() {
        super("anytype.Change.Snapshot", [
            { no: 1, name: "logHeads", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } },
            { no: 2, name: "data", kind: "message", T: () => SmartBlockSnapshotBase },
            { no: 3, name: "fileKeys", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Change_FileKeys }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.Snapshot
 */
export const Change_Snapshot = new Change_Snapshot$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_FileKeys$Type extends MessageType<Change_FileKeys> {
    constructor() {
        super("anytype.Change.FileKeys", [
            { no: 1, name: "hash", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "keys", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.FileKeys
 */
export const Change_FileKeys = new Change_FileKeys$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_Content$Type extends MessageType<Change_Content> {
    constructor() {
        super("anytype.Change.Content", [
            { no: 1, name: "blockCreate", kind: "message", oneof: "value", T: () => Change_BlockCreate },
            { no: 2, name: "blockUpdate", kind: "message", oneof: "value", T: () => Change_BlockUpdate },
            { no: 3, name: "blockRemove", kind: "message", oneof: "value", T: () => Change_BlockRemove },
            { no: 4, name: "blockMove", kind: "message", oneof: "value", T: () => Change_BlockMove },
            { no: 5, name: "blockDuplicate", kind: "message", oneof: "value", T: () => Change_BlockDuplicate },
            { no: 50, name: "relationAdd", kind: "message", oneof: "value", T: () => Change_RelationAdd },
            { no: 51, name: "relationRemove", kind: "message", oneof: "value", T: () => Change_RelationRemove },
            { no: 100, name: "detailsSet", kind: "message", oneof: "value", T: () => Change_DetailsSet },
            { no: 101, name: "detailsUnset", kind: "message", oneof: "value", T: () => Change_DetailsUnset },
            { no: 105, name: "objectTypeAdd", kind: "message", oneof: "value", T: () => Change_ObjectTypeAdd },
            { no: 106, name: "objectTypeRemove", kind: "message", oneof: "value", T: () => Change_ObjectTypeRemove },
            { no: 107, name: "storeKeySet", kind: "message", oneof: "value", T: () => Change_StoreKeySet },
            { no: 108, name: "storeKeyUnset", kind: "message", oneof: "value", T: () => Change_StoreKeyUnset },
            { no: 109, name: "storeSliceUpdate", kind: "message", oneof: "value", T: () => Change_StoreSliceUpdate },
            { no: 110, name: "originalCreatedTimestampSet", kind: "message", oneof: "value", T: () => Change_OriginalCreatedTimestampSet },
            { no: 111, name: "setFileInfo", kind: "message", oneof: "value", T: () => Change_SetFileInfo },
            { no: 112, name: "notificationCreate", kind: "message", oneof: "value", T: () => Change_NotificationCreate },
            { no: 113, name: "notificationUpdate", kind: "message", oneof: "value", T: () => Change_NotificationUpdate },
            { no: 114, name: "deviceAdd", kind: "message", oneof: "value", T: () => Change_DeviceAdd },
            { no: 115, name: "deviceUpdate", kind: "message", oneof: "value", T: () => Change_DeviceUpdate }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.Content
 */
export const Change_Content = new Change_Content$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_BlockCreate$Type extends MessageType<Change_BlockCreate> {
    constructor() {
        super("anytype.Change.BlockCreate", [
            { no: 1, name: "targetId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "position", kind: "enum", T: () => ["anytype.model.Block.Position", Block_Position] },
            { no: 3, name: "blocks", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Block }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.BlockCreate
 */
export const Change_BlockCreate = new Change_BlockCreate$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_BlockUpdate$Type extends MessageType<Change_BlockUpdate> {
    constructor() {
        super("anytype.Change.BlockUpdate", [
            { no: 2, name: "events", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Event_Message }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.BlockUpdate
 */
export const Change_BlockUpdate = new Change_BlockUpdate$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_BlockRemove$Type extends MessageType<Change_BlockRemove> {
    constructor() {
        super("anytype.Change.BlockRemove", [
            { no: 1, name: "ids", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.BlockRemove
 */
export const Change_BlockRemove = new Change_BlockRemove$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_BlockMove$Type extends MessageType<Change_BlockMove> {
    constructor() {
        super("anytype.Change.BlockMove", [
            { no: 1, name: "targetId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "position", kind: "enum", T: () => ["anytype.model.Block.Position", Block_Position] },
            { no: 3, name: "ids", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.BlockMove
 */
export const Change_BlockMove = new Change_BlockMove$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_BlockDuplicate$Type extends MessageType<Change_BlockDuplicate> {
    constructor() {
        super("anytype.Change.BlockDuplicate", [
            { no: 1, name: "targetId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "position", kind: "enum", T: () => ["anytype.model.Block.Position", Block_Position] },
            { no: 3, name: "ids", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.BlockDuplicate
 */
export const Change_BlockDuplicate = new Change_BlockDuplicate$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_DetailsSet$Type extends MessageType<Change_DetailsSet> {
    constructor() {
        super("anytype.Change.DetailsSet", [
            { no: 1, name: "key", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "value", kind: "message", T: () => Value }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.DetailsSet
 */
export const Change_DetailsSet = new Change_DetailsSet$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_DetailsUnset$Type extends MessageType<Change_DetailsUnset> {
    constructor() {
        super("anytype.Change.DetailsUnset", [
            { no: 1, name: "key", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.DetailsUnset
 */
export const Change_DetailsUnset = new Change_DetailsUnset$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_RelationAdd$Type extends MessageType<Change_RelationAdd> {
    constructor() {
        super("anytype.Change.RelationAdd", [
            { no: 1, name: "relationLinks", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => RelationLink }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.RelationAdd
 */
export const Change_RelationAdd = new Change_RelationAdd$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_RelationRemove$Type extends MessageType<Change_RelationRemove> {
    constructor() {
        super("anytype.Change.RelationRemove", [
            { no: 1, name: "relationKey", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.RelationRemove
 */
export const Change_RelationRemove = new Change_RelationRemove$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_ObjectTypeAdd$Type extends MessageType<Change_ObjectTypeAdd> {
    constructor() {
        super("anytype.Change.ObjectTypeAdd", [
            { no: 1, name: "url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "key", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.ObjectTypeAdd
 */
export const Change_ObjectTypeAdd = new Change_ObjectTypeAdd$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_ObjectTypeRemove$Type extends MessageType<Change_ObjectTypeRemove> {
    constructor() {
        super("anytype.Change.ObjectTypeRemove", [
            { no: 1, name: "url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "key", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.ObjectTypeRemove
 */
export const Change_ObjectTypeRemove = new Change_ObjectTypeRemove$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_StoreKeySet$Type extends MessageType<Change_StoreKeySet> {
    constructor() {
        super("anytype.Change.StoreKeySet", [
            { no: 1, name: "path", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "value", kind: "message", T: () => Value }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.StoreKeySet
 */
export const Change_StoreKeySet = new Change_StoreKeySet$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_StoreKeyUnset$Type extends MessageType<Change_StoreKeyUnset> {
    constructor() {
        super("anytype.Change.StoreKeyUnset", [
            { no: 1, name: "path", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.StoreKeyUnset
 */
export const Change_StoreKeyUnset = new Change_StoreKeyUnset$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_StoreSliceUpdate$Type extends MessageType<Change_StoreSliceUpdate> {
    constructor() {
        super("anytype.Change.StoreSliceUpdate", [
            { no: 1, name: "key", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "add", kind: "message", oneof: "operation", T: () => Change_StoreSliceUpdate_Add },
            { no: 3, name: "remove", kind: "message", oneof: "operation", T: () => Change_StoreSliceUpdate_Remove },
            { no: 4, name: "move", kind: "message", oneof: "operation", T: () => Change_StoreSliceUpdate_Move }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.StoreSliceUpdate
 */
export const Change_StoreSliceUpdate = new Change_StoreSliceUpdate$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_StoreSliceUpdate_Add$Type extends MessageType<Change_StoreSliceUpdate_Add> {
    constructor() {
        super("anytype.Change.StoreSliceUpdate.Add", [
            { no: 1, name: "afterId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "ids", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.StoreSliceUpdate.Add
 */
export const Change_StoreSliceUpdate_Add = new Change_StoreSliceUpdate_Add$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_StoreSliceUpdate_Remove$Type extends MessageType<Change_StoreSliceUpdate_Remove> {
    constructor() {
        super("anytype.Change.StoreSliceUpdate.Remove", [
            { no: 1, name: "ids", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.StoreSliceUpdate.Remove
 */
export const Change_StoreSliceUpdate_Remove = new Change_StoreSliceUpdate_Remove$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_StoreSliceUpdate_Move$Type extends MessageType<Change_StoreSliceUpdate_Move> {
    constructor() {
        super("anytype.Change.StoreSliceUpdate.Move", [
            { no: 1, name: "afterId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "ids", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.StoreSliceUpdate.Move
 */
export const Change_StoreSliceUpdate_Move = new Change_StoreSliceUpdate_Move$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_OriginalCreatedTimestampSet$Type extends MessageType<Change_OriginalCreatedTimestampSet> {
    constructor() {
        super("anytype.Change.OriginalCreatedTimestampSet", [
            { no: 1, name: "ts", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.OriginalCreatedTimestampSet
 */
export const Change_OriginalCreatedTimestampSet = new Change_OriginalCreatedTimestampSet$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_SetFileInfo$Type extends MessageType<Change_SetFileInfo> {
    constructor() {
        super("anytype.Change.SetFileInfo", [
            { no: 1, name: "fileInfo", kind: "message", T: () => FileInfo }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.SetFileInfo
 */
export const Change_SetFileInfo = new Change_SetFileInfo$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_NotificationCreate$Type extends MessageType<Change_NotificationCreate> {
    constructor() {
        super("anytype.Change.NotificationCreate", [
            { no: 1, name: "notification", kind: "message", T: () => Notification }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.NotificationCreate
 */
export const Change_NotificationCreate = new Change_NotificationCreate$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_NotificationUpdate$Type extends MessageType<Change_NotificationUpdate> {
    constructor() {
        super("anytype.Change.NotificationUpdate", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "status", kind: "enum", T: () => ["anytype.model.Notification.Status", Notification_Status] }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.NotificationUpdate
 */
export const Change_NotificationUpdate = new Change_NotificationUpdate$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_DeviceAdd$Type extends MessageType<Change_DeviceAdd> {
    constructor() {
        super("anytype.Change.DeviceAdd", [
            { no: 1, name: "device", kind: "message", T: () => DeviceInfo }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.DeviceAdd
 */
export const Change_DeviceAdd = new Change_DeviceAdd$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Change_DeviceUpdate$Type extends MessageType<Change_DeviceUpdate> {
    constructor() {
        super("anytype.Change.DeviceUpdate", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message anytype.Change.DeviceUpdate
 */
export const Change_DeviceUpdate = new Change_DeviceUpdate$Type();