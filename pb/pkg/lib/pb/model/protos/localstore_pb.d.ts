import * as jspb from 'google-protobuf'

import * as google_protobuf_struct_pb from 'google-protobuf/google/protobuf/struct_pb';
import * as pkg_lib_pb_model_protos_models_pb from '../../../../../pkg/lib/pb/model/protos/models_pb';


export class ObjectInfo extends jspb.Message {
  getId(): string;
  setId(value: string): ObjectInfo;

  getObjecttypeurlsList(): Array<string>;
  setObjecttypeurlsList(value: Array<string>): ObjectInfo;
  clearObjecttypeurlsList(): ObjectInfo;
  addObjecttypeurls(value: string, index?: number): ObjectInfo;

  getDetails(): google_protobuf_struct_pb.Struct | undefined;
  setDetails(value?: google_protobuf_struct_pb.Struct): ObjectInfo;
  hasDetails(): boolean;
  clearDetails(): ObjectInfo;

  getRelationsList(): Array<pkg_lib_pb_model_protos_models_pb.Relation>;
  setRelationsList(value: Array<pkg_lib_pb_model_protos_models_pb.Relation>): ObjectInfo;
  clearRelationsList(): ObjectInfo;
  addRelations(value?: pkg_lib_pb_model_protos_models_pb.Relation, index?: number): pkg_lib_pb_model_protos_models_pb.Relation;

  getSnippet(): string;
  setSnippet(value: string): ObjectInfo;

  getHasinboundlinks(): boolean;
  setHasinboundlinks(value: boolean): ObjectInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ObjectInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ObjectInfo): ObjectInfo.AsObject;
  static serializeBinaryToWriter(message: ObjectInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ObjectInfo;
  static deserializeBinaryFromReader(message: ObjectInfo, reader: jspb.BinaryReader): ObjectInfo;
}

export namespace ObjectInfo {
  export type AsObject = {
    id: string,
    objecttypeurlsList: Array<string>,
    details?: google_protobuf_struct_pb.Struct.AsObject,
    relationsList: Array<pkg_lib_pb_model_protos_models_pb.Relation.AsObject>,
    snippet: string,
    hasinboundlinks: boolean,
  }
}

export class ObjectDetails extends jspb.Message {
  getDetails(): google_protobuf_struct_pb.Struct | undefined;
  setDetails(value?: google_protobuf_struct_pb.Struct): ObjectDetails;
  hasDetails(): boolean;
  clearDetails(): ObjectDetails;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ObjectDetails.AsObject;
  static toObject(includeInstance: boolean, msg: ObjectDetails): ObjectDetails.AsObject;
  static serializeBinaryToWriter(message: ObjectDetails, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ObjectDetails;
  static deserializeBinaryFromReader(message: ObjectDetails, reader: jspb.BinaryReader): ObjectDetails;
}

export namespace ObjectDetails {
  export type AsObject = {
    details?: google_protobuf_struct_pb.Struct.AsObject,
  }
}

export class ObjectLinks extends jspb.Message {
  getInboundidsList(): Array<string>;
  setInboundidsList(value: Array<string>): ObjectLinks;
  clearInboundidsList(): ObjectLinks;
  addInboundids(value: string, index?: number): ObjectLinks;

  getOutboundidsList(): Array<string>;
  setOutboundidsList(value: Array<string>): ObjectLinks;
  clearOutboundidsList(): ObjectLinks;
  addOutboundids(value: string, index?: number): ObjectLinks;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ObjectLinks.AsObject;
  static toObject(includeInstance: boolean, msg: ObjectLinks): ObjectLinks.AsObject;
  static serializeBinaryToWriter(message: ObjectLinks, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ObjectLinks;
  static deserializeBinaryFromReader(message: ObjectLinks, reader: jspb.BinaryReader): ObjectLinks;
}

export namespace ObjectLinks {
  export type AsObject = {
    inboundidsList: Array<string>,
    outboundidsList: Array<string>,
  }
}

export class ObjectLinksInfo extends jspb.Message {
  getInboundList(): Array<ObjectInfo>;
  setInboundList(value: Array<ObjectInfo>): ObjectLinksInfo;
  clearInboundList(): ObjectLinksInfo;
  addInbound(value?: ObjectInfo, index?: number): ObjectInfo;

  getOutboundList(): Array<ObjectInfo>;
  setOutboundList(value: Array<ObjectInfo>): ObjectLinksInfo;
  clearOutboundList(): ObjectLinksInfo;
  addOutbound(value?: ObjectInfo, index?: number): ObjectInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ObjectLinksInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ObjectLinksInfo): ObjectLinksInfo.AsObject;
  static serializeBinaryToWriter(message: ObjectLinksInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ObjectLinksInfo;
  static deserializeBinaryFromReader(message: ObjectLinksInfo, reader: jspb.BinaryReader): ObjectLinksInfo;
}

export namespace ObjectLinksInfo {
  export type AsObject = {
    inboundList: Array<ObjectInfo.AsObject>,
    outboundList: Array<ObjectInfo.AsObject>,
  }
}

export class ObjectInfoWithLinks extends jspb.Message {
  getId(): string;
  setId(value: string): ObjectInfoWithLinks;

  getInfo(): ObjectInfo | undefined;
  setInfo(value?: ObjectInfo): ObjectInfoWithLinks;
  hasInfo(): boolean;
  clearInfo(): ObjectInfoWithLinks;

  getLinks(): ObjectLinksInfo | undefined;
  setLinks(value?: ObjectLinksInfo): ObjectInfoWithLinks;
  hasLinks(): boolean;
  clearLinks(): ObjectInfoWithLinks;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ObjectInfoWithLinks.AsObject;
  static toObject(includeInstance: boolean, msg: ObjectInfoWithLinks): ObjectInfoWithLinks.AsObject;
  static serializeBinaryToWriter(message: ObjectInfoWithLinks, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ObjectInfoWithLinks;
  static deserializeBinaryFromReader(message: ObjectInfoWithLinks, reader: jspb.BinaryReader): ObjectInfoWithLinks;
}

export namespace ObjectInfoWithLinks {
  export type AsObject = {
    id: string,
    info?: ObjectInfo.AsObject,
    links?: ObjectLinksInfo.AsObject,
  }
}

export class ObjectInfoWithOutboundLinks extends jspb.Message {
  getId(): string;
  setId(value: string): ObjectInfoWithOutboundLinks;

  getInfo(): ObjectInfo | undefined;
  setInfo(value?: ObjectInfo): ObjectInfoWithOutboundLinks;
  hasInfo(): boolean;
  clearInfo(): ObjectInfoWithOutboundLinks;

  getOutboundlinksList(): Array<ObjectInfo>;
  setOutboundlinksList(value: Array<ObjectInfo>): ObjectInfoWithOutboundLinks;
  clearOutboundlinksList(): ObjectInfoWithOutboundLinks;
  addOutboundlinks(value?: ObjectInfo, index?: number): ObjectInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ObjectInfoWithOutboundLinks.AsObject;
  static toObject(includeInstance: boolean, msg: ObjectInfoWithOutboundLinks): ObjectInfoWithOutboundLinks.AsObject;
  static serializeBinaryToWriter(message: ObjectInfoWithOutboundLinks, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ObjectInfoWithOutboundLinks;
  static deserializeBinaryFromReader(message: ObjectInfoWithOutboundLinks, reader: jspb.BinaryReader): ObjectInfoWithOutboundLinks;
}

export namespace ObjectInfoWithOutboundLinks {
  export type AsObject = {
    id: string,
    info?: ObjectInfo.AsObject,
    outboundlinksList: Array<ObjectInfo.AsObject>,
  }
}

export class ObjectInfoWithOutboundLinksIDs extends jspb.Message {
  getId(): string;
  setId(value: string): ObjectInfoWithOutboundLinksIDs;

  getInfo(): ObjectInfo | undefined;
  setInfo(value?: ObjectInfo): ObjectInfoWithOutboundLinksIDs;
  hasInfo(): boolean;
  clearInfo(): ObjectInfoWithOutboundLinksIDs;

  getOutboundlinksList(): Array<string>;
  setOutboundlinksList(value: Array<string>): ObjectInfoWithOutboundLinksIDs;
  clearOutboundlinksList(): ObjectInfoWithOutboundLinksIDs;
  addOutboundlinks(value: string, index?: number): ObjectInfoWithOutboundLinksIDs;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ObjectInfoWithOutboundLinksIDs.AsObject;
  static toObject(includeInstance: boolean, msg: ObjectInfoWithOutboundLinksIDs): ObjectInfoWithOutboundLinksIDs.AsObject;
  static serializeBinaryToWriter(message: ObjectInfoWithOutboundLinksIDs, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ObjectInfoWithOutboundLinksIDs;
  static deserializeBinaryFromReader(message: ObjectInfoWithOutboundLinksIDs, reader: jspb.BinaryReader): ObjectInfoWithOutboundLinksIDs;
}

export namespace ObjectInfoWithOutboundLinksIDs {
  export type AsObject = {
    id: string,
    info?: ObjectInfo.AsObject,
    outboundlinksList: Array<string>,
  }
}

export class ObjectStoreChecksums extends jspb.Message {
  getBundledobjecttypes(): string;
  setBundledobjecttypes(value: string): ObjectStoreChecksums;

  getBundledrelations(): string;
  setBundledrelations(value: string): ObjectStoreChecksums;

  getBundledlayouts(): string;
  setBundledlayouts(value: string): ObjectStoreChecksums;

  getObjectsforcereindexcounter(): number;
  setObjectsforcereindexcounter(value: number): ObjectStoreChecksums;

  getFilesforcereindexcounter(): number;
  setFilesforcereindexcounter(value: number): ObjectStoreChecksums;

  getIdxrebuildcounter(): number;
  setIdxrebuildcounter(value: number): ObjectStoreChecksums;

  getFulltextrebuild(): number;
  setFulltextrebuild(value: number): ObjectStoreChecksums;

  getFulltexterase(): number;
  setFulltexterase(value: number): ObjectStoreChecksums;

  getBundledtemplates(): string;
  setBundledtemplates(value: string): ObjectStoreChecksums;

  getBundledobjects(): number;
  setBundledobjects(value: number): ObjectStoreChecksums;

  getFilestorekeysforcereindexcounter(): number;
  setFilestorekeysforcereindexcounter(value: number): ObjectStoreChecksums;

  getAreoldfilesremoved(): boolean;
  setAreoldfilesremoved(value: boolean): ObjectStoreChecksums;

  getAredeletedobjectsreindexed(): boolean;
  setAredeletedobjectsreindexed(value: boolean): ObjectStoreChecksums;

  getLinkserase(): number;
  setLinkserase(value: number): ObjectStoreChecksums;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ObjectStoreChecksums.AsObject;
  static toObject(includeInstance: boolean, msg: ObjectStoreChecksums): ObjectStoreChecksums.AsObject;
  static serializeBinaryToWriter(message: ObjectStoreChecksums, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ObjectStoreChecksums;
  static deserializeBinaryFromReader(message: ObjectStoreChecksums, reader: jspb.BinaryReader): ObjectStoreChecksums;
}

export namespace ObjectStoreChecksums {
  export type AsObject = {
    bundledobjecttypes: string,
    bundledrelations: string,
    bundledlayouts: string,
    objectsforcereindexcounter: number,
    filesforcereindexcounter: number,
    idxrebuildcounter: number,
    fulltextrebuild: number,
    fulltexterase: number,
    bundledtemplates: string,
    bundledobjects: number,
    filestorekeysforcereindexcounter: number,
    areoldfilesremoved: boolean,
    aredeletedobjectsreindexed: boolean,
    linkserase: number,
  }
}

