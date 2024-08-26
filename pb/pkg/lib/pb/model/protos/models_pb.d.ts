import * as jspb from 'google-protobuf'

import * as google_protobuf_struct_pb from 'google-protobuf/google/protobuf/struct_pb';


export class SmartBlockSnapshotBase extends jspb.Message {
  getBlocksList(): Array<Block>;
  setBlocksList(value: Array<Block>): SmartBlockSnapshotBase;
  clearBlocksList(): SmartBlockSnapshotBase;
  addBlocks(value?: Block, index?: number): Block;

  getDetails(): google_protobuf_struct_pb.Struct | undefined;
  setDetails(value?: google_protobuf_struct_pb.Struct): SmartBlockSnapshotBase;
  hasDetails(): boolean;
  clearDetails(): SmartBlockSnapshotBase;

  getFilekeys(): google_protobuf_struct_pb.Struct | undefined;
  setFilekeys(value?: google_protobuf_struct_pb.Struct): SmartBlockSnapshotBase;
  hasFilekeys(): boolean;
  clearFilekeys(): SmartBlockSnapshotBase;

  getExtrarelationsList(): Array<Relation>;
  setExtrarelationsList(value: Array<Relation>): SmartBlockSnapshotBase;
  clearExtrarelationsList(): SmartBlockSnapshotBase;
  addExtrarelations(value?: Relation, index?: number): Relation;

  getObjecttypesList(): Array<string>;
  setObjecttypesList(value: Array<string>): SmartBlockSnapshotBase;
  clearObjecttypesList(): SmartBlockSnapshotBase;
  addObjecttypes(value: string, index?: number): SmartBlockSnapshotBase;

  getCollections(): google_protobuf_struct_pb.Struct | undefined;
  setCollections(value?: google_protobuf_struct_pb.Struct): SmartBlockSnapshotBase;
  hasCollections(): boolean;
  clearCollections(): SmartBlockSnapshotBase;

  getRemovedcollectionkeysList(): Array<string>;
  setRemovedcollectionkeysList(value: Array<string>): SmartBlockSnapshotBase;
  clearRemovedcollectionkeysList(): SmartBlockSnapshotBase;
  addRemovedcollectionkeys(value: string, index?: number): SmartBlockSnapshotBase;

  getRelationlinksList(): Array<RelationLink>;
  setRelationlinksList(value: Array<RelationLink>): SmartBlockSnapshotBase;
  clearRelationlinksList(): SmartBlockSnapshotBase;
  addRelationlinks(value?: RelationLink, index?: number): RelationLink;

  getKey(): string;
  setKey(value: string): SmartBlockSnapshotBase;

  getOriginalcreatedtimestamp(): number;
  setOriginalcreatedtimestamp(value: number): SmartBlockSnapshotBase;

  getFileinfo(): FileInfo | undefined;
  setFileinfo(value?: FileInfo): SmartBlockSnapshotBase;
  hasFileinfo(): boolean;
  clearFileinfo(): SmartBlockSnapshotBase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SmartBlockSnapshotBase.AsObject;
  static toObject(includeInstance: boolean, msg: SmartBlockSnapshotBase): SmartBlockSnapshotBase.AsObject;
  static serializeBinaryToWriter(message: SmartBlockSnapshotBase, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SmartBlockSnapshotBase;
  static deserializeBinaryFromReader(message: SmartBlockSnapshotBase, reader: jspb.BinaryReader): SmartBlockSnapshotBase;
}

export namespace SmartBlockSnapshotBase {
  export type AsObject = {
    blocksList: Array<Block.AsObject>,
    details?: google_protobuf_struct_pb.Struct.AsObject,
    filekeys?: google_protobuf_struct_pb.Struct.AsObject,
    extrarelationsList: Array<Relation.AsObject>,
    objecttypesList: Array<string>,
    collections?: google_protobuf_struct_pb.Struct.AsObject,
    removedcollectionkeysList: Array<string>,
    relationlinksList: Array<RelationLink.AsObject>,
    key: string,
    originalcreatedtimestamp: number,
    fileinfo?: FileInfo.AsObject,
  }
}

export class Search extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Search.AsObject;
  static toObject(includeInstance: boolean, msg: Search): Search.AsObject;
  static serializeBinaryToWriter(message: Search, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Search;
  static deserializeBinaryFromReader(message: Search, reader: jspb.BinaryReader): Search;
}

export namespace Search {
  export type AsObject = {
  }

  export class Result extends jspb.Message {
    getObjectid(): string;
    setObjectid(value: string): Result;

    getDetails(): google_protobuf_struct_pb.Struct | undefined;
    setDetails(value?: google_protobuf_struct_pb.Struct): Result;
    hasDetails(): boolean;
    clearDetails(): Result;

    getMetaList(): Array<Search.Meta>;
    setMetaList(value: Array<Search.Meta>): Result;
    clearMetaList(): Result;
    addMeta(value?: Search.Meta, index?: number): Search.Meta;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Result.AsObject;
    static toObject(includeInstance: boolean, msg: Result): Result.AsObject;
    static serializeBinaryToWriter(message: Result, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Result;
    static deserializeBinaryFromReader(message: Result, reader: jspb.BinaryReader): Result;
  }

  export namespace Result {
    export type AsObject = {
      objectid: string,
      details?: google_protobuf_struct_pb.Struct.AsObject,
      metaList: Array<Search.Meta.AsObject>,
    }
  }


  export class Meta extends jspb.Message {
    getHighlight(): string;
    setHighlight(value: string): Meta;

    getHighlightrangesList(): Array<Range>;
    setHighlightrangesList(value: Array<Range>): Meta;
    clearHighlightrangesList(): Meta;
    addHighlightranges(value?: Range, index?: number): Range;

    getBlockid(): string;
    setBlockid(value: string): Meta;

    getRelationkey(): string;
    setRelationkey(value: string): Meta;

    getRelationdetails(): google_protobuf_struct_pb.Struct | undefined;
    setRelationdetails(value?: google_protobuf_struct_pb.Struct): Meta;
    hasRelationdetails(): boolean;
    clearRelationdetails(): Meta;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Meta.AsObject;
    static toObject(includeInstance: boolean, msg: Meta): Meta.AsObject;
    static serializeBinaryToWriter(message: Meta, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Meta;
    static deserializeBinaryFromReader(message: Meta, reader: jspb.BinaryReader): Meta;
  }

  export namespace Meta {
    export type AsObject = {
      highlight: string,
      highlightrangesList: Array<Range.AsObject>,
      blockid: string,
      relationkey: string,
      relationdetails?: google_protobuf_struct_pb.Struct.AsObject,
    }
  }

}

export class Block extends jspb.Message {
  getId(): string;
  setId(value: string): Block;

  getFields(): google_protobuf_struct_pb.Struct | undefined;
  setFields(value?: google_protobuf_struct_pb.Struct): Block;
  hasFields(): boolean;
  clearFields(): Block;

  getRestrictions(): Block.Restrictions | undefined;
  setRestrictions(value?: Block.Restrictions): Block;
  hasRestrictions(): boolean;
  clearRestrictions(): Block;

  getChildrenidsList(): Array<string>;
  setChildrenidsList(value: Array<string>): Block;
  clearChildrenidsList(): Block;
  addChildrenids(value: string, index?: number): Block;

  getBackgroundcolor(): string;
  setBackgroundcolor(value: string): Block;

  getAlign(): Block.Align;
  setAlign(value: Block.Align): Block;

  getVerticalalign(): Block.VerticalAlign;
  setVerticalalign(value: Block.VerticalAlign): Block;

  getSmartblock(): Block.Content.Smartblock | undefined;
  setSmartblock(value?: Block.Content.Smartblock): Block;
  hasSmartblock(): boolean;
  clearSmartblock(): Block;

  getText(): Block.Content.Text | undefined;
  setText(value?: Block.Content.Text): Block;
  hasText(): boolean;
  clearText(): Block;

  getFile(): Block.Content.File | undefined;
  setFile(value?: Block.Content.File): Block;
  hasFile(): boolean;
  clearFile(): Block;

  getLayout(): Block.Content.Layout | undefined;
  setLayout(value?: Block.Content.Layout): Block;
  hasLayout(): boolean;
  clearLayout(): Block;

  getDiv(): Block.Content.Div | undefined;
  setDiv(value?: Block.Content.Div): Block;
  hasDiv(): boolean;
  clearDiv(): Block;

  getBookmark(): Block.Content.Bookmark | undefined;
  setBookmark(value?: Block.Content.Bookmark): Block;
  hasBookmark(): boolean;
  clearBookmark(): Block;

  getIcon(): Block.Content.Icon | undefined;
  setIcon(value?: Block.Content.Icon): Block;
  hasIcon(): boolean;
  clearIcon(): Block;

  getLink(): Block.Content.Link | undefined;
  setLink(value?: Block.Content.Link): Block;
  hasLink(): boolean;
  clearLink(): Block;

  getDataview(): Block.Content.Dataview | undefined;
  setDataview(value?: Block.Content.Dataview): Block;
  hasDataview(): boolean;
  clearDataview(): Block;

  getRelation(): Block.Content.Relation | undefined;
  setRelation(value?: Block.Content.Relation): Block;
  hasRelation(): boolean;
  clearRelation(): Block;

  getFeaturedrelations(): Block.Content.FeaturedRelations | undefined;
  setFeaturedrelations(value?: Block.Content.FeaturedRelations): Block;
  hasFeaturedrelations(): boolean;
  clearFeaturedrelations(): Block;

  getLatex(): Block.Content.Latex | undefined;
  setLatex(value?: Block.Content.Latex): Block;
  hasLatex(): boolean;
  clearLatex(): Block;

  getTableofcontents(): Block.Content.TableOfContents | undefined;
  setTableofcontents(value?: Block.Content.TableOfContents): Block;
  hasTableofcontents(): boolean;
  clearTableofcontents(): Block;

  getTable(): Block.Content.Table | undefined;
  setTable(value?: Block.Content.Table): Block;
  hasTable(): boolean;
  clearTable(): Block;

  getTablecolumn(): Block.Content.TableColumn | undefined;
  setTablecolumn(value?: Block.Content.TableColumn): Block;
  hasTablecolumn(): boolean;
  clearTablecolumn(): Block;

  getTablerow(): Block.Content.TableRow | undefined;
  setTablerow(value?: Block.Content.TableRow): Block;
  hasTablerow(): boolean;
  clearTablerow(): Block;

  getWidget(): Block.Content.Widget | undefined;
  setWidget(value?: Block.Content.Widget): Block;
  hasWidget(): boolean;
  clearWidget(): Block;

  getContentCase(): Block.ContentCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Block.AsObject;
  static toObject(includeInstance: boolean, msg: Block): Block.AsObject;
  static serializeBinaryToWriter(message: Block, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Block;
  static deserializeBinaryFromReader(message: Block, reader: jspb.BinaryReader): Block;
}

export namespace Block {
  export type AsObject = {
    id: string,
    fields?: google_protobuf_struct_pb.Struct.AsObject,
    restrictions?: Block.Restrictions.AsObject,
    childrenidsList: Array<string>,
    backgroundcolor: string,
    align: Block.Align,
    verticalalign: Block.VerticalAlign,
    smartblock?: Block.Content.Smartblock.AsObject,
    text?: Block.Content.Text.AsObject,
    file?: Block.Content.File.AsObject,
    layout?: Block.Content.Layout.AsObject,
    div?: Block.Content.Div.AsObject,
    bookmark?: Block.Content.Bookmark.AsObject,
    icon?: Block.Content.Icon.AsObject,
    link?: Block.Content.Link.AsObject,
    dataview?: Block.Content.Dataview.AsObject,
    relation?: Block.Content.Relation.AsObject,
    featuredrelations?: Block.Content.FeaturedRelations.AsObject,
    latex?: Block.Content.Latex.AsObject,
    tableofcontents?: Block.Content.TableOfContents.AsObject,
    table?: Block.Content.Table.AsObject,
    tablecolumn?: Block.Content.TableColumn.AsObject,
    tablerow?: Block.Content.TableRow.AsObject,
    widget?: Block.Content.Widget.AsObject,
  }

  export class Restrictions extends jspb.Message {
    getRead(): boolean;
    setRead(value: boolean): Restrictions;

    getEdit(): boolean;
    setEdit(value: boolean): Restrictions;

    getRemove(): boolean;
    setRemove(value: boolean): Restrictions;

    getDrag(): boolean;
    setDrag(value: boolean): Restrictions;

    getDropon(): boolean;
    setDropon(value: boolean): Restrictions;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Restrictions.AsObject;
    static toObject(includeInstance: boolean, msg: Restrictions): Restrictions.AsObject;
    static serializeBinaryToWriter(message: Restrictions, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Restrictions;
    static deserializeBinaryFromReader(message: Restrictions, reader: jspb.BinaryReader): Restrictions;
  }

  export namespace Restrictions {
    export type AsObject = {
      read: boolean,
      edit: boolean,
      remove: boolean,
      drag: boolean,
      dropon: boolean,
    }
  }


  export class Content extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Content.AsObject;
    static toObject(includeInstance: boolean, msg: Content): Content.AsObject;
    static serializeBinaryToWriter(message: Content, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Content;
    static deserializeBinaryFromReader(message: Content, reader: jspb.BinaryReader): Content;
  }

  export namespace Content {
    export type AsObject = {
    }

    export class Layout extends jspb.Message {
      getStyle(): Block.Content.Layout.Style;
      setStyle(value: Block.Content.Layout.Style): Layout;

      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): Layout.AsObject;
      static toObject(includeInstance: boolean, msg: Layout): Layout.AsObject;
      static serializeBinaryToWriter(message: Layout, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): Layout;
      static deserializeBinaryFromReader(message: Layout, reader: jspb.BinaryReader): Layout;
    }

    export namespace Layout {
      export type AsObject = {
        style: Block.Content.Layout.Style,
      }

      export enum Style { 
        ROW = 0,
        COLUMN = 1,
        DIV = 2,
        HEADER = 3,
        TABLEROWS = 4,
        TABLECOLUMNS = 5,
      }
    }


    export class Link extends jspb.Message {
      getTargetblockid(): string;
      setTargetblockid(value: string): Link;

      getStyle(): Block.Content.Link.Style;
      setStyle(value: Block.Content.Link.Style): Link;

      getFields(): google_protobuf_struct_pb.Struct | undefined;
      setFields(value?: google_protobuf_struct_pb.Struct): Link;
      hasFields(): boolean;
      clearFields(): Link;

      getIconsize(): Block.Content.Link.IconSize;
      setIconsize(value: Block.Content.Link.IconSize): Link;

      getCardstyle(): Block.Content.Link.CardStyle;
      setCardstyle(value: Block.Content.Link.CardStyle): Link;

      getDescription(): Block.Content.Link.Description;
      setDescription(value: Block.Content.Link.Description): Link;

      getRelationsList(): Array<string>;
      setRelationsList(value: Array<string>): Link;
      clearRelationsList(): Link;
      addRelations(value: string, index?: number): Link;

      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): Link.AsObject;
      static toObject(includeInstance: boolean, msg: Link): Link.AsObject;
      static serializeBinaryToWriter(message: Link, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): Link;
      static deserializeBinaryFromReader(message: Link, reader: jspb.BinaryReader): Link;
    }

    export namespace Link {
      export type AsObject = {
        targetblockid: string,
        style: Block.Content.Link.Style,
        fields?: google_protobuf_struct_pb.Struct.AsObject,
        iconsize: Block.Content.Link.IconSize,
        cardstyle: Block.Content.Link.CardStyle,
        description: Block.Content.Link.Description,
        relationsList: Array<string>,
      }

      export enum IconSize { 
        SIZENONE = 0,
        SIZESMALL = 1,
        SIZEMEDIUM = 2,
      }

      export enum Style { 
        PAGE = 0,
        DATAVIEW = 1,
        DASHBOARD = 2,
        ARCHIVE = 3,
      }

      export enum Description { 
        NONE = 0,
        ADDED = 1,
        CONTENT = 2,
      }

      export enum CardStyle { 
        TEXT = 0,
        CARD = 1,
        INLINE = 2,
      }
    }


    export class Div extends jspb.Message {
      getStyle(): Block.Content.Div.Style;
      setStyle(value: Block.Content.Div.Style): Div;

      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): Div.AsObject;
      static toObject(includeInstance: boolean, msg: Div): Div.AsObject;
      static serializeBinaryToWriter(message: Div, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): Div;
      static deserializeBinaryFromReader(message: Div, reader: jspb.BinaryReader): Div;
    }

    export namespace Div {
      export type AsObject = {
        style: Block.Content.Div.Style,
      }

      export enum Style { 
        LINE = 0,
        DOTS = 1,
      }
    }


    export class Bookmark extends jspb.Message {
      getUrl(): string;
      setUrl(value: string): Bookmark;

      getTitle(): string;
      setTitle(value: string): Bookmark;

      getDescription(): string;
      setDescription(value: string): Bookmark;

      getImagehash(): string;
      setImagehash(value: string): Bookmark;

      getFaviconhash(): string;
      setFaviconhash(value: string): Bookmark;

      getType(): LinkPreview.Type;
      setType(value: LinkPreview.Type): Bookmark;

      getTargetobjectid(): string;
      setTargetobjectid(value: string): Bookmark;

      getState(): Block.Content.Bookmark.State;
      setState(value: Block.Content.Bookmark.State): Bookmark;

      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): Bookmark.AsObject;
      static toObject(includeInstance: boolean, msg: Bookmark): Bookmark.AsObject;
      static serializeBinaryToWriter(message: Bookmark, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): Bookmark;
      static deserializeBinaryFromReader(message: Bookmark, reader: jspb.BinaryReader): Bookmark;
    }

    export namespace Bookmark {
      export type AsObject = {
        url: string,
        title: string,
        description: string,
        imagehash: string,
        faviconhash: string,
        type: LinkPreview.Type,
        targetobjectid: string,
        state: Block.Content.Bookmark.State,
      }

      export enum State { 
        EMPTY = 0,
        FETCHING = 1,
        DONE = 2,
        ERROR = 3,
      }
    }


    export class Icon extends jspb.Message {
      getName(): string;
      setName(value: string): Icon;

      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): Icon.AsObject;
      static toObject(includeInstance: boolean, msg: Icon): Icon.AsObject;
      static serializeBinaryToWriter(message: Icon, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): Icon;
      static deserializeBinaryFromReader(message: Icon, reader: jspb.BinaryReader): Icon;
    }

    export namespace Icon {
      export type AsObject = {
        name: string,
      }
    }


    export class FeaturedRelations extends jspb.Message {
      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): FeaturedRelations.AsObject;
      static toObject(includeInstance: boolean, msg: FeaturedRelations): FeaturedRelations.AsObject;
      static serializeBinaryToWriter(message: FeaturedRelations, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): FeaturedRelations;
      static deserializeBinaryFromReader(message: FeaturedRelations, reader: jspb.BinaryReader): FeaturedRelations;
    }

    export namespace FeaturedRelations {
      export type AsObject = {
      }
    }


    export class Text extends jspb.Message {
      getText(): string;
      setText(value: string): Text;

      getStyle(): Block.Content.Text.Style;
      setStyle(value: Block.Content.Text.Style): Text;

      getMarks(): Block.Content.Text.Marks | undefined;
      setMarks(value?: Block.Content.Text.Marks): Text;
      hasMarks(): boolean;
      clearMarks(): Text;

      getChecked(): boolean;
      setChecked(value: boolean): Text;

      getColor(): string;
      setColor(value: string): Text;

      getIconemoji(): string;
      setIconemoji(value: string): Text;

      getIconimage(): string;
      setIconimage(value: string): Text;

      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): Text.AsObject;
      static toObject(includeInstance: boolean, msg: Text): Text.AsObject;
      static serializeBinaryToWriter(message: Text, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): Text;
      static deserializeBinaryFromReader(message: Text, reader: jspb.BinaryReader): Text;
    }

    export namespace Text {
      export type AsObject = {
        text: string,
        style: Block.Content.Text.Style,
        marks?: Block.Content.Text.Marks.AsObject,
        checked: boolean,
        color: string,
        iconemoji: string,
        iconimage: string,
      }

      export class Marks extends jspb.Message {
        getMarksList(): Array<Block.Content.Text.Mark>;
        setMarksList(value: Array<Block.Content.Text.Mark>): Marks;
        clearMarksList(): Marks;
        addMarks(value?: Block.Content.Text.Mark, index?: number): Block.Content.Text.Mark;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): Marks.AsObject;
        static toObject(includeInstance: boolean, msg: Marks): Marks.AsObject;
        static serializeBinaryToWriter(message: Marks, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): Marks;
        static deserializeBinaryFromReader(message: Marks, reader: jspb.BinaryReader): Marks;
      }

      export namespace Marks {
        export type AsObject = {
          marksList: Array<Block.Content.Text.Mark.AsObject>,
        }
      }


      export class Mark extends jspb.Message {
        getRange(): Range | undefined;
        setRange(value?: Range): Mark;
        hasRange(): boolean;
        clearRange(): Mark;

        getType(): Block.Content.Text.Mark.Type;
        setType(value: Block.Content.Text.Mark.Type): Mark;

        getParam(): string;
        setParam(value: string): Mark;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): Mark.AsObject;
        static toObject(includeInstance: boolean, msg: Mark): Mark.AsObject;
        static serializeBinaryToWriter(message: Mark, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): Mark;
        static deserializeBinaryFromReader(message: Mark, reader: jspb.BinaryReader): Mark;
      }

      export namespace Mark {
        export type AsObject = {
          range?: Range.AsObject,
          type: Block.Content.Text.Mark.Type,
          param: string,
        }

        export enum Type { 
          STRIKETHROUGH = 0,
          KEYBOARD = 1,
          ITALIC = 2,
          BOLD = 3,
          UNDERSCORED = 4,
          LINK = 5,
          TEXTCOLOR = 6,
          BACKGROUNDCOLOR = 7,
          MENTION = 8,
          EMOJI = 9,
          OBJECT = 10,
        }
      }


      export enum Style { 
        PARAGRAPH = 0,
        HEADER1 = 1,
        HEADER2 = 2,
        HEADER3 = 3,
        HEADER4 = 4,
        QUOTE = 5,
        CODE = 6,
        TITLE = 7,
        CHECKBOX = 8,
        MARKED = 9,
        NUMBERED = 10,
        TOGGLE = 11,
        DESCRIPTION = 12,
        CALLOUT = 13,
      }
    }


    export class File extends jspb.Message {
      getHash(): string;
      setHash(value: string): File;

      getName(): string;
      setName(value: string): File;

      getType(): Block.Content.File.Type;
      setType(value: Block.Content.File.Type): File;

      getMime(): string;
      setMime(value: string): File;

      getSize(): number;
      setSize(value: number): File;

      getAddedat(): number;
      setAddedat(value: number): File;

      getTargetobjectid(): string;
      setTargetobjectid(value: string): File;

      getState(): Block.Content.File.State;
      setState(value: Block.Content.File.State): File;

      getStyle(): Block.Content.File.Style;
      setStyle(value: Block.Content.File.Style): File;

      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): File.AsObject;
      static toObject(includeInstance: boolean, msg: File): File.AsObject;
      static serializeBinaryToWriter(message: File, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): File;
      static deserializeBinaryFromReader(message: File, reader: jspb.BinaryReader): File;
    }

    export namespace File {
      export type AsObject = {
        hash: string,
        name: string,
        type: Block.Content.File.Type,
        mime: string,
        size: number,
        addedat: number,
        targetobjectid: string,
        state: Block.Content.File.State,
        style: Block.Content.File.Style,
      }

      export enum Type { 
        NONE = 0,
        FILE = 1,
        IMAGE = 2,
        VIDEO = 3,
        AUDIO = 4,
        PDF = 5,
      }

      export enum Style { 
        AUTO = 0,
        LINK = 1,
        EMBED = 2,
      }

      export enum State { 
        EMPTY = 0,
        UPLOADING = 1,
        DONE = 2,
        ERROR = 3,
      }
    }


    export class Smartblock extends jspb.Message {
      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): Smartblock.AsObject;
      static toObject(includeInstance: boolean, msg: Smartblock): Smartblock.AsObject;
      static serializeBinaryToWriter(message: Smartblock, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): Smartblock;
      static deserializeBinaryFromReader(message: Smartblock, reader: jspb.BinaryReader): Smartblock;
    }

    export namespace Smartblock {
      export type AsObject = {
      }
    }


    export class Dataview extends jspb.Message {
      getSourceList(): Array<string>;
      setSourceList(value: Array<string>): Dataview;
      clearSourceList(): Dataview;
      addSource(value: string, index?: number): Dataview;

      getViewsList(): Array<Block.Content.Dataview.View>;
      setViewsList(value: Array<Block.Content.Dataview.View>): Dataview;
      clearViewsList(): Dataview;
      addViews(value?: Block.Content.Dataview.View, index?: number): Block.Content.Dataview.View;

      getActiveview(): string;
      setActiveview(value: string): Dataview;

      getRelationsList(): Array<Relation>;
      setRelationsList(value: Array<Relation>): Dataview;
      clearRelationsList(): Dataview;
      addRelations(value?: Relation, index?: number): Relation;

      getGroupordersList(): Array<Block.Content.Dataview.GroupOrder>;
      setGroupordersList(value: Array<Block.Content.Dataview.GroupOrder>): Dataview;
      clearGroupordersList(): Dataview;
      addGrouporders(value?: Block.Content.Dataview.GroupOrder, index?: number): Block.Content.Dataview.GroupOrder;

      getObjectordersList(): Array<Block.Content.Dataview.ObjectOrder>;
      setObjectordersList(value: Array<Block.Content.Dataview.ObjectOrder>): Dataview;
      clearObjectordersList(): Dataview;
      addObjectorders(value?: Block.Content.Dataview.ObjectOrder, index?: number): Block.Content.Dataview.ObjectOrder;

      getRelationlinksList(): Array<RelationLink>;
      setRelationlinksList(value: Array<RelationLink>): Dataview;
      clearRelationlinksList(): Dataview;
      addRelationlinks(value?: RelationLink, index?: number): RelationLink;

      getTargetobjectid(): string;
      setTargetobjectid(value: string): Dataview;

      getIscollection(): boolean;
      setIscollection(value: boolean): Dataview;

      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): Dataview.AsObject;
      static toObject(includeInstance: boolean, msg: Dataview): Dataview.AsObject;
      static serializeBinaryToWriter(message: Dataview, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): Dataview;
      static deserializeBinaryFromReader(message: Dataview, reader: jspb.BinaryReader): Dataview;
    }

    export namespace Dataview {
      export type AsObject = {
        sourceList: Array<string>,
        viewsList: Array<Block.Content.Dataview.View.AsObject>,
        activeview: string,
        relationsList: Array<Relation.AsObject>,
        groupordersList: Array<Block.Content.Dataview.GroupOrder.AsObject>,
        objectordersList: Array<Block.Content.Dataview.ObjectOrder.AsObject>,
        relationlinksList: Array<RelationLink.AsObject>,
        targetobjectid: string,
        iscollection: boolean,
      }

      export class View extends jspb.Message {
        getId(): string;
        setId(value: string): View;

        getType(): Block.Content.Dataview.View.Type;
        setType(value: Block.Content.Dataview.View.Type): View;

        getName(): string;
        setName(value: string): View;

        getSortsList(): Array<Block.Content.Dataview.Sort>;
        setSortsList(value: Array<Block.Content.Dataview.Sort>): View;
        clearSortsList(): View;
        addSorts(value?: Block.Content.Dataview.Sort, index?: number): Block.Content.Dataview.Sort;

        getFiltersList(): Array<Block.Content.Dataview.Filter>;
        setFiltersList(value: Array<Block.Content.Dataview.Filter>): View;
        clearFiltersList(): View;
        addFilters(value?: Block.Content.Dataview.Filter, index?: number): Block.Content.Dataview.Filter;

        getRelationsList(): Array<Block.Content.Dataview.Relation>;
        setRelationsList(value: Array<Block.Content.Dataview.Relation>): View;
        clearRelationsList(): View;
        addRelations(value?: Block.Content.Dataview.Relation, index?: number): Block.Content.Dataview.Relation;

        getCoverrelationkey(): string;
        setCoverrelationkey(value: string): View;

        getHideicon(): boolean;
        setHideicon(value: boolean): View;

        getCardsize(): Block.Content.Dataview.View.Size;
        setCardsize(value: Block.Content.Dataview.View.Size): View;

        getCoverfit(): boolean;
        setCoverfit(value: boolean): View;

        getGrouprelationkey(): string;
        setGrouprelationkey(value: string): View;

        getGroupbackgroundcolors(): boolean;
        setGroupbackgroundcolors(value: boolean): View;

        getPagelimit(): number;
        setPagelimit(value: number): View;

        getDefaulttemplateid(): string;
        setDefaulttemplateid(value: string): View;

        getDefaultobjecttypeid(): string;
        setDefaultobjecttypeid(value: string): View;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): View.AsObject;
        static toObject(includeInstance: boolean, msg: View): View.AsObject;
        static serializeBinaryToWriter(message: View, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): View;
        static deserializeBinaryFromReader(message: View, reader: jspb.BinaryReader): View;
      }

      export namespace View {
        export type AsObject = {
          id: string,
          type: Block.Content.Dataview.View.Type,
          name: string,
          sortsList: Array<Block.Content.Dataview.Sort.AsObject>,
          filtersList: Array<Block.Content.Dataview.Filter.AsObject>,
          relationsList: Array<Block.Content.Dataview.Relation.AsObject>,
          coverrelationkey: string,
          hideicon: boolean,
          cardsize: Block.Content.Dataview.View.Size,
          coverfit: boolean,
          grouprelationkey: string,
          groupbackgroundcolors: boolean,
          pagelimit: number,
          defaulttemplateid: string,
          defaultobjecttypeid: string,
        }

        export enum Type { 
          TABLE = 0,
          LIST = 1,
          GALLERY = 2,
          KANBAN = 3,
          CALENDAR = 4,
          GRAPH = 5,
        }

        export enum Size { 
          SMALL = 0,
          MEDIUM = 1,
          LARGE = 2,
        }
      }


      export class Relation extends jspb.Message {
        getKey(): string;
        setKey(value: string): Relation;

        getIsvisible(): boolean;
        setIsvisible(value: boolean): Relation;

        getWidth(): number;
        setWidth(value: number): Relation;

        getDateincludetime(): boolean;
        setDateincludetime(value: boolean): Relation;

        getTimeformat(): Block.Content.Dataview.Relation.TimeFormat;
        setTimeformat(value: Block.Content.Dataview.Relation.TimeFormat): Relation;

        getDateformat(): Block.Content.Dataview.Relation.DateFormat;
        setDateformat(value: Block.Content.Dataview.Relation.DateFormat): Relation;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): Relation.AsObject;
        static toObject(includeInstance: boolean, msg: Relation): Relation.AsObject;
        static serializeBinaryToWriter(message: Relation, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): Relation;
        static deserializeBinaryFromReader(message: Relation, reader: jspb.BinaryReader): Relation;
      }

      export namespace Relation {
        export type AsObject = {
          key: string,
          isvisible: boolean,
          width: number,
          dateincludetime: boolean,
          timeformat: Block.Content.Dataview.Relation.TimeFormat,
          dateformat: Block.Content.Dataview.Relation.DateFormat,
        }

        export enum DateFormat { 
          MONTHABBRBEFOREDAY = 0,
          MONTHABBRAFTERDAY = 1,
          SHORT = 2,
          SHORTUS = 3,
          ISO = 4,
        }

        export enum TimeFormat { 
          FORMAT12 = 0,
          FORMAT24 = 1,
        }
      }


      export class Sort extends jspb.Message {
        getRelationkey(): string;
        setRelationkey(value: string): Sort;

        getType(): Block.Content.Dataview.Sort.Type;
        setType(value: Block.Content.Dataview.Sort.Type): Sort;

        getCustomorderList(): Array<google_protobuf_struct_pb.Value>;
        setCustomorderList(value: Array<google_protobuf_struct_pb.Value>): Sort;
        clearCustomorderList(): Sort;
        addCustomorder(value?: google_protobuf_struct_pb.Value, index?: number): google_protobuf_struct_pb.Value;

        getFormat(): RelationFormat;
        setFormat(value: RelationFormat): Sort;

        getIncludetime(): boolean;
        setIncludetime(value: boolean): Sort;

        getId(): string;
        setId(value: string): Sort;

        getEmptyplacement(): Block.Content.Dataview.Sort.EmptyType;
        setEmptyplacement(value: Block.Content.Dataview.Sort.EmptyType): Sort;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): Sort.AsObject;
        static toObject(includeInstance: boolean, msg: Sort): Sort.AsObject;
        static serializeBinaryToWriter(message: Sort, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): Sort;
        static deserializeBinaryFromReader(message: Sort, reader: jspb.BinaryReader): Sort;
      }

      export namespace Sort {
        export type AsObject = {
          relationkey: string,
          type: Block.Content.Dataview.Sort.Type,
          customorderList: Array<google_protobuf_struct_pb.Value.AsObject>,
          format: RelationFormat,
          includetime: boolean,
          id: string,
          emptyplacement: Block.Content.Dataview.Sort.EmptyType,
        }

        export enum Type { 
          ASC = 0,
          DESC = 1,
          CUSTOM = 2,
        }

        export enum EmptyType { 
          NOTSPECIFIED = 0,
          START = 1,
          END = 2,
        }
      }


      export class Filter extends jspb.Message {
        getId(): string;
        setId(value: string): Filter;

        getOperator(): Block.Content.Dataview.Filter.Operator;
        setOperator(value: Block.Content.Dataview.Filter.Operator): Filter;

        getRelationkey(): string;
        setRelationkey(value: string): Filter;

        getRelationproperty(): string;
        setRelationproperty(value: string): Filter;

        getCondition(): Block.Content.Dataview.Filter.Condition;
        setCondition(value: Block.Content.Dataview.Filter.Condition): Filter;

        getValue(): google_protobuf_struct_pb.Value | undefined;
        setValue(value?: google_protobuf_struct_pb.Value): Filter;
        hasValue(): boolean;
        clearValue(): Filter;

        getQuickoption(): Block.Content.Dataview.Filter.QuickOption;
        setQuickoption(value: Block.Content.Dataview.Filter.QuickOption): Filter;

        getFormat(): RelationFormat;
        setFormat(value: RelationFormat): Filter;

        getIncludetime(): boolean;
        setIncludetime(value: boolean): Filter;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): Filter.AsObject;
        static toObject(includeInstance: boolean, msg: Filter): Filter.AsObject;
        static serializeBinaryToWriter(message: Filter, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): Filter;
        static deserializeBinaryFromReader(message: Filter, reader: jspb.BinaryReader): Filter;
      }

      export namespace Filter {
        export type AsObject = {
          id: string,
          operator: Block.Content.Dataview.Filter.Operator,
          relationkey: string,
          relationproperty: string,
          condition: Block.Content.Dataview.Filter.Condition,
          value?: google_protobuf_struct_pb.Value.AsObject,
          quickoption: Block.Content.Dataview.Filter.QuickOption,
          format: RelationFormat,
          includetime: boolean,
        }

        export enum Operator { 
          AND = 0,
          OR = 1,
        }

        export enum Condition { 
          NONE = 0,
          EQUAL = 1,
          NOTEQUAL = 2,
          GREATER = 3,
          LESS = 4,
          GREATEROREQUAL = 5,
          LESSOREQUAL = 6,
          LIKE = 7,
          NOTLIKE = 8,
          IN = 9,
          NOTIN = 10,
          EMPTY = 11,
          NOTEMPTY = 12,
          ALLIN = 13,
          NOTALLIN = 14,
          EXACTIN = 15,
          NOTEXACTIN = 16,
          EXISTS = 17,
        }

        export enum QuickOption { 
          EXACTDATE = 0,
          YESTERDAY = 1,
          TODAY = 2,
          TOMORROW = 3,
          LASTWEEK = 4,
          CURRENTWEEK = 5,
          NEXTWEEK = 6,
          LASTMONTH = 7,
          CURRENTMONTH = 8,
          NEXTMONTH = 9,
          NUMBEROFDAYSAGO = 10,
          NUMBEROFDAYSNOW = 11,
        }
      }


      export class GroupOrder extends jspb.Message {
        getViewid(): string;
        setViewid(value: string): GroupOrder;

        getViewgroupsList(): Array<Block.Content.Dataview.ViewGroup>;
        setViewgroupsList(value: Array<Block.Content.Dataview.ViewGroup>): GroupOrder;
        clearViewgroupsList(): GroupOrder;
        addViewgroups(value?: Block.Content.Dataview.ViewGroup, index?: number): Block.Content.Dataview.ViewGroup;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): GroupOrder.AsObject;
        static toObject(includeInstance: boolean, msg: GroupOrder): GroupOrder.AsObject;
        static serializeBinaryToWriter(message: GroupOrder, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): GroupOrder;
        static deserializeBinaryFromReader(message: GroupOrder, reader: jspb.BinaryReader): GroupOrder;
      }

      export namespace GroupOrder {
        export type AsObject = {
          viewid: string,
          viewgroupsList: Array<Block.Content.Dataview.ViewGroup.AsObject>,
        }
      }


      export class ViewGroup extends jspb.Message {
        getGroupid(): string;
        setGroupid(value: string): ViewGroup;

        getIndex(): number;
        setIndex(value: number): ViewGroup;

        getHidden(): boolean;
        setHidden(value: boolean): ViewGroup;

        getBackgroundcolor(): string;
        setBackgroundcolor(value: string): ViewGroup;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): ViewGroup.AsObject;
        static toObject(includeInstance: boolean, msg: ViewGroup): ViewGroup.AsObject;
        static serializeBinaryToWriter(message: ViewGroup, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): ViewGroup;
        static deserializeBinaryFromReader(message: ViewGroup, reader: jspb.BinaryReader): ViewGroup;
      }

      export namespace ViewGroup {
        export type AsObject = {
          groupid: string,
          index: number,
          hidden: boolean,
          backgroundcolor: string,
        }
      }


      export class ObjectOrder extends jspb.Message {
        getViewid(): string;
        setViewid(value: string): ObjectOrder;

        getGroupid(): string;
        setGroupid(value: string): ObjectOrder;

        getObjectidsList(): Array<string>;
        setObjectidsList(value: Array<string>): ObjectOrder;
        clearObjectidsList(): ObjectOrder;
        addObjectids(value: string, index?: number): ObjectOrder;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): ObjectOrder.AsObject;
        static toObject(includeInstance: boolean, msg: ObjectOrder): ObjectOrder.AsObject;
        static serializeBinaryToWriter(message: ObjectOrder, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): ObjectOrder;
        static deserializeBinaryFromReader(message: ObjectOrder, reader: jspb.BinaryReader): ObjectOrder;
      }

      export namespace ObjectOrder {
        export type AsObject = {
          viewid: string,
          groupid: string,
          objectidsList: Array<string>,
        }
      }


      export class Group extends jspb.Message {
        getId(): string;
        setId(value: string): Group;

        getStatus(): Block.Content.Dataview.Status | undefined;
        setStatus(value?: Block.Content.Dataview.Status): Group;
        hasStatus(): boolean;
        clearStatus(): Group;

        getTag(): Block.Content.Dataview.Tag | undefined;
        setTag(value?: Block.Content.Dataview.Tag): Group;
        hasTag(): boolean;
        clearTag(): Group;

        getCheckbox(): Block.Content.Dataview.Checkbox | undefined;
        setCheckbox(value?: Block.Content.Dataview.Checkbox): Group;
        hasCheckbox(): boolean;
        clearCheckbox(): Group;

        getDate(): Block.Content.Dataview.Date | undefined;
        setDate(value?: Block.Content.Dataview.Date): Group;
        hasDate(): boolean;
        clearDate(): Group;

        getValueCase(): Group.ValueCase;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): Group.AsObject;
        static toObject(includeInstance: boolean, msg: Group): Group.AsObject;
        static serializeBinaryToWriter(message: Group, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): Group;
        static deserializeBinaryFromReader(message: Group, reader: jspb.BinaryReader): Group;
      }

      export namespace Group {
        export type AsObject = {
          id: string,
          status?: Block.Content.Dataview.Status.AsObject,
          tag?: Block.Content.Dataview.Tag.AsObject,
          checkbox?: Block.Content.Dataview.Checkbox.AsObject,
          date?: Block.Content.Dataview.Date.AsObject,
        }

        export enum ValueCase { 
          VALUE_NOT_SET = 0,
          STATUS = 2,
          TAG = 3,
          CHECKBOX = 4,
          DATE = 5,
        }
      }


      export class Status extends jspb.Message {
        getId(): string;
        setId(value: string): Status;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): Status.AsObject;
        static toObject(includeInstance: boolean, msg: Status): Status.AsObject;
        static serializeBinaryToWriter(message: Status, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): Status;
        static deserializeBinaryFromReader(message: Status, reader: jspb.BinaryReader): Status;
      }

      export namespace Status {
        export type AsObject = {
          id: string,
        }
      }


      export class Tag extends jspb.Message {
        getIdsList(): Array<string>;
        setIdsList(value: Array<string>): Tag;
        clearIdsList(): Tag;
        addIds(value: string, index?: number): Tag;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): Tag.AsObject;
        static toObject(includeInstance: boolean, msg: Tag): Tag.AsObject;
        static serializeBinaryToWriter(message: Tag, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): Tag;
        static deserializeBinaryFromReader(message: Tag, reader: jspb.BinaryReader): Tag;
      }

      export namespace Tag {
        export type AsObject = {
          idsList: Array<string>,
        }
      }


      export class Checkbox extends jspb.Message {
        getChecked(): boolean;
        setChecked(value: boolean): Checkbox;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): Checkbox.AsObject;
        static toObject(includeInstance: boolean, msg: Checkbox): Checkbox.AsObject;
        static serializeBinaryToWriter(message: Checkbox, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): Checkbox;
        static deserializeBinaryFromReader(message: Checkbox, reader: jspb.BinaryReader): Checkbox;
      }

      export namespace Checkbox {
        export type AsObject = {
          checked: boolean,
        }
      }


      export class Date extends jspb.Message {
        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): Date.AsObject;
        static toObject(includeInstance: boolean, msg: Date): Date.AsObject;
        static serializeBinaryToWriter(message: Date, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): Date;
        static deserializeBinaryFromReader(message: Date, reader: jspb.BinaryReader): Date;
      }

      export namespace Date {
        export type AsObject = {
        }
      }

    }


    export class Relation extends jspb.Message {
      getKey(): string;
      setKey(value: string): Relation;

      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): Relation.AsObject;
      static toObject(includeInstance: boolean, msg: Relation): Relation.AsObject;
      static serializeBinaryToWriter(message: Relation, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): Relation;
      static deserializeBinaryFromReader(message: Relation, reader: jspb.BinaryReader): Relation;
    }

    export namespace Relation {
      export type AsObject = {
        key: string,
      }
    }


    export class Latex extends jspb.Message {
      getText(): string;
      setText(value: string): Latex;

      getProcessor(): Block.Content.Latex.Processor;
      setProcessor(value: Block.Content.Latex.Processor): Latex;

      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): Latex.AsObject;
      static toObject(includeInstance: boolean, msg: Latex): Latex.AsObject;
      static serializeBinaryToWriter(message: Latex, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): Latex;
      static deserializeBinaryFromReader(message: Latex, reader: jspb.BinaryReader): Latex;
    }

    export namespace Latex {
      export type AsObject = {
        text: string,
        processor: Block.Content.Latex.Processor,
      }

      export enum Processor { 
        LATEX = 0,
        MERMAID = 1,
        CHART = 2,
        YOUTUBE = 3,
        VIMEO = 4,
        SOUNDCLOUD = 5,
        GOOGLEMAPS = 6,
        MIRO = 7,
        FIGMA = 8,
        TWITTER = 9,
        OPENSTREETMAP = 10,
        REDDIT = 11,
        FACEBOOK = 12,
        INSTAGRAM = 13,
        TELEGRAM = 14,
        GITHUBGIST = 15,
        CODEPEN = 16,
        BILIBILI = 17,
        EXCALIDRAW = 18,
      }
    }


    export class TableOfContents extends jspb.Message {
      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): TableOfContents.AsObject;
      static toObject(includeInstance: boolean, msg: TableOfContents): TableOfContents.AsObject;
      static serializeBinaryToWriter(message: TableOfContents, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): TableOfContents;
      static deserializeBinaryFromReader(message: TableOfContents, reader: jspb.BinaryReader): TableOfContents;
    }

    export namespace TableOfContents {
      export type AsObject = {
      }
    }


    export class Table extends jspb.Message {
      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): Table.AsObject;
      static toObject(includeInstance: boolean, msg: Table): Table.AsObject;
      static serializeBinaryToWriter(message: Table, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): Table;
      static deserializeBinaryFromReader(message: Table, reader: jspb.BinaryReader): Table;
    }

    export namespace Table {
      export type AsObject = {
      }
    }


    export class TableColumn extends jspb.Message {
      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): TableColumn.AsObject;
      static toObject(includeInstance: boolean, msg: TableColumn): TableColumn.AsObject;
      static serializeBinaryToWriter(message: TableColumn, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): TableColumn;
      static deserializeBinaryFromReader(message: TableColumn, reader: jspb.BinaryReader): TableColumn;
    }

    export namespace TableColumn {
      export type AsObject = {
      }
    }


    export class TableRow extends jspb.Message {
      getIsheader(): boolean;
      setIsheader(value: boolean): TableRow;

      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): TableRow.AsObject;
      static toObject(includeInstance: boolean, msg: TableRow): TableRow.AsObject;
      static serializeBinaryToWriter(message: TableRow, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): TableRow;
      static deserializeBinaryFromReader(message: TableRow, reader: jspb.BinaryReader): TableRow;
    }

    export namespace TableRow {
      export type AsObject = {
        isheader: boolean,
      }
    }


    export class Widget extends jspb.Message {
      getLayout(): Block.Content.Widget.Layout;
      setLayout(value: Block.Content.Widget.Layout): Widget;

      getLimit(): number;
      setLimit(value: number): Widget;

      getViewid(): string;
      setViewid(value: string): Widget;

      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): Widget.AsObject;
      static toObject(includeInstance: boolean, msg: Widget): Widget.AsObject;
      static serializeBinaryToWriter(message: Widget, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): Widget;
      static deserializeBinaryFromReader(message: Widget, reader: jspb.BinaryReader): Widget;
    }

    export namespace Widget {
      export type AsObject = {
        layout: Block.Content.Widget.Layout,
        limit: number,
        viewid: string,
      }

      export enum Layout { 
        LINK = 0,
        TREE = 1,
        LIST = 2,
        COMPACTLIST = 3,
        VIEW = 4,
      }
    }

  }


  export enum Position { 
    NONE = 0,
    TOP = 1,
    BOTTOM = 2,
    LEFT = 3,
    RIGHT = 4,
    INNER = 5,
    REPLACE = 6,
    INNERFIRST = 7,
  }

  export enum Align { 
    ALIGNLEFT = 0,
    ALIGNCENTER = 1,
    ALIGNRIGHT = 2,
    ALIGNJUSTIFY = 3,
  }

  export enum VerticalAlign { 
    VERTICALALIGNTOP = 0,
    VERTICALALIGNMIDDLE = 1,
    VERTICALALIGNBOTTOM = 2,
  }

  export enum ContentCase { 
    CONTENT_NOT_SET = 0,
    SMARTBLOCK = 11,
    TEXT = 14,
    FILE = 15,
    LAYOUT = 16,
    DIV = 17,
    BOOKMARK = 18,
    ICON = 19,
    LINK = 20,
    DATAVIEW = 21,
    RELATION = 22,
    FEATUREDRELATIONS = 23,
    LATEX = 24,
    TABLEOFCONTENTS = 25,
    TABLE = 26,
    TABLECOLUMN = 27,
    TABLEROW = 28,
    WIDGET = 29,
  }
}

export class BlockMetaOnly extends jspb.Message {
  getId(): string;
  setId(value: string): BlockMetaOnly;

  getFields(): google_protobuf_struct_pb.Struct | undefined;
  setFields(value?: google_protobuf_struct_pb.Struct): BlockMetaOnly;
  hasFields(): boolean;
  clearFields(): BlockMetaOnly;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockMetaOnly.AsObject;
  static toObject(includeInstance: boolean, msg: BlockMetaOnly): BlockMetaOnly.AsObject;
  static serializeBinaryToWriter(message: BlockMetaOnly, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockMetaOnly;
  static deserializeBinaryFromReader(message: BlockMetaOnly, reader: jspb.BinaryReader): BlockMetaOnly;
}

export namespace BlockMetaOnly {
  export type AsObject = {
    id: string,
    fields?: google_protobuf_struct_pb.Struct.AsObject,
  }
}

export class Range extends jspb.Message {
  getFrom(): number;
  setFrom(value: number): Range;

  getTo(): number;
  setTo(value: number): Range;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Range.AsObject;
  static toObject(includeInstance: boolean, msg: Range): Range.AsObject;
  static serializeBinaryToWriter(message: Range, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Range;
  static deserializeBinaryFromReader(message: Range, reader: jspb.BinaryReader): Range;
}

export namespace Range {
  export type AsObject = {
    from: number,
    to: number,
  }
}

export class Account extends jspb.Message {
  getId(): string;
  setId(value: string): Account;

  getConfig(): Account.Config | undefined;
  setConfig(value?: Account.Config): Account;
  hasConfig(): boolean;
  clearConfig(): Account;

  getStatus(): Account.Status | undefined;
  setStatus(value?: Account.Status): Account;
  hasStatus(): boolean;
  clearStatus(): Account;

  getInfo(): Account.Info | undefined;
  setInfo(value?: Account.Info): Account;
  hasInfo(): boolean;
  clearInfo(): Account;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Account.AsObject;
  static toObject(includeInstance: boolean, msg: Account): Account.AsObject;
  static serializeBinaryToWriter(message: Account, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Account;
  static deserializeBinaryFromReader(message: Account, reader: jspb.BinaryReader): Account;
}

export namespace Account {
  export type AsObject = {
    id: string,
    config?: Account.Config.AsObject,
    status?: Account.Status.AsObject,
    info?: Account.Info.AsObject,
  }

  export class Config extends jspb.Message {
    getEnabledataview(): boolean;
    setEnabledataview(value: boolean): Config;

    getEnabledebug(): boolean;
    setEnabledebug(value: boolean): Config;

    getEnableprereleasechannel(): boolean;
    setEnableprereleasechannel(value: boolean): Config;

    getEnablespaces(): boolean;
    setEnablespaces(value: boolean): Config;

    getExtra(): google_protobuf_struct_pb.Struct | undefined;
    setExtra(value?: google_protobuf_struct_pb.Struct): Config;
    hasExtra(): boolean;
    clearExtra(): Config;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Config.AsObject;
    static toObject(includeInstance: boolean, msg: Config): Config.AsObject;
    static serializeBinaryToWriter(message: Config, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Config;
    static deserializeBinaryFromReader(message: Config, reader: jspb.BinaryReader): Config;
  }

  export namespace Config {
    export type AsObject = {
      enabledataview: boolean,
      enabledebug: boolean,
      enableprereleasechannel: boolean,
      enablespaces: boolean,
      extra?: google_protobuf_struct_pb.Struct.AsObject,
    }
  }


  export class Status extends jspb.Message {
    getStatustype(): Account.StatusType;
    setStatustype(value: Account.StatusType): Status;

    getDeletiondate(): number;
    setDeletiondate(value: number): Status;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Status.AsObject;
    static toObject(includeInstance: boolean, msg: Status): Status.AsObject;
    static serializeBinaryToWriter(message: Status, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Status;
    static deserializeBinaryFromReader(message: Status, reader: jspb.BinaryReader): Status;
  }

  export namespace Status {
    export type AsObject = {
      statustype: Account.StatusType,
      deletiondate: number,
    }
  }


  export class Info extends jspb.Message {
    getHomeobjectid(): string;
    setHomeobjectid(value: string): Info;

    getArchiveobjectid(): string;
    setArchiveobjectid(value: string): Info;

    getProfileobjectid(): string;
    setProfileobjectid(value: string): Info;

    getMarketplaceworkspaceid(): string;
    setMarketplaceworkspaceid(value: string): Info;

    getDeviceid(): string;
    setDeviceid(value: string): Info;

    getAccountspaceid(): string;
    setAccountspaceid(value: string): Info;

    getWidgetsid(): string;
    setWidgetsid(value: string): Info;

    getSpaceviewid(): string;
    setSpaceviewid(value: string): Info;

    getTechspaceid(): string;
    setTechspaceid(value: string): Info;

    getGatewayurl(): string;
    setGatewayurl(value: string): Info;

    getLocalstoragepath(): string;
    setLocalstoragepath(value: string): Info;

    getTimezone(): string;
    setTimezone(value: string): Info;

    getAnalyticsid(): string;
    setAnalyticsid(value: string): Info;

    getNetworkid(): string;
    setNetworkid(value: string): Info;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Info.AsObject;
    static toObject(includeInstance: boolean, msg: Info): Info.AsObject;
    static serializeBinaryToWriter(message: Info, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Info;
    static deserializeBinaryFromReader(message: Info, reader: jspb.BinaryReader): Info;
  }

  export namespace Info {
    export type AsObject = {
      homeobjectid: string,
      archiveobjectid: string,
      profileobjectid: string,
      marketplaceworkspaceid: string,
      deviceid: string,
      accountspaceid: string,
      widgetsid: string,
      spaceviewid: string,
      techspaceid: string,
      gatewayurl: string,
      localstoragepath: string,
      timezone: string,
      analyticsid: string,
      networkid: string,
    }
  }


  export enum StatusType { 
    ACTIVE = 0,
    PENDINGDELETION = 1,
    STARTEDDELETION = 2,
    DELETED = 3,
  }
}

export class LinkPreview extends jspb.Message {
  getUrl(): string;
  setUrl(value: string): LinkPreview;

  getTitle(): string;
  setTitle(value: string): LinkPreview;

  getDescription(): string;
  setDescription(value: string): LinkPreview;

  getImageurl(): string;
  setImageurl(value: string): LinkPreview;

  getFaviconurl(): string;
  setFaviconurl(value: string): LinkPreview;

  getType(): LinkPreview.Type;
  setType(value: LinkPreview.Type): LinkPreview;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LinkPreview.AsObject;
  static toObject(includeInstance: boolean, msg: LinkPreview): LinkPreview.AsObject;
  static serializeBinaryToWriter(message: LinkPreview, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LinkPreview;
  static deserializeBinaryFromReader(message: LinkPreview, reader: jspb.BinaryReader): LinkPreview;
}

export namespace LinkPreview {
  export type AsObject = {
    url: string,
    title: string,
    description: string,
    imageurl: string,
    faviconurl: string,
    type: LinkPreview.Type,
  }

  export enum Type { 
    UNKNOWN = 0,
    PAGE = 1,
    IMAGE = 2,
    TEXT = 3,
  }
}

export class Restrictions extends jspb.Message {
  getObjectList(): Array<Restrictions.ObjectRestriction>;
  setObjectList(value: Array<Restrictions.ObjectRestriction>): Restrictions;
  clearObjectList(): Restrictions;
  addObject(value: Restrictions.ObjectRestriction, index?: number): Restrictions;

  getDataviewList(): Array<Restrictions.DataviewRestrictions>;
  setDataviewList(value: Array<Restrictions.DataviewRestrictions>): Restrictions;
  clearDataviewList(): Restrictions;
  addDataview(value?: Restrictions.DataviewRestrictions, index?: number): Restrictions.DataviewRestrictions;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Restrictions.AsObject;
  static toObject(includeInstance: boolean, msg: Restrictions): Restrictions.AsObject;
  static serializeBinaryToWriter(message: Restrictions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Restrictions;
  static deserializeBinaryFromReader(message: Restrictions, reader: jspb.BinaryReader): Restrictions;
}

export namespace Restrictions {
  export type AsObject = {
    objectList: Array<Restrictions.ObjectRestriction>,
    dataviewList: Array<Restrictions.DataviewRestrictions.AsObject>,
  }

  export class DataviewRestrictions extends jspb.Message {
    getBlockid(): string;
    setBlockid(value: string): DataviewRestrictions;

    getRestrictionsList(): Array<Restrictions.DataviewRestriction>;
    setRestrictionsList(value: Array<Restrictions.DataviewRestriction>): DataviewRestrictions;
    clearRestrictionsList(): DataviewRestrictions;
    addRestrictions(value: Restrictions.DataviewRestriction, index?: number): DataviewRestrictions;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DataviewRestrictions.AsObject;
    static toObject(includeInstance: boolean, msg: DataviewRestrictions): DataviewRestrictions.AsObject;
    static serializeBinaryToWriter(message: DataviewRestrictions, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DataviewRestrictions;
    static deserializeBinaryFromReader(message: DataviewRestrictions, reader: jspb.BinaryReader): DataviewRestrictions;
  }

  export namespace DataviewRestrictions {
    export type AsObject = {
      blockid: string,
      restrictionsList: Array<Restrictions.DataviewRestriction>,
    }
  }


  export enum ObjectRestriction { 
    NONE = 0,
    DELETE = 1,
    RELATIONS = 2,
    BLOCKS = 3,
    DETAILS = 4,
    TYPECHANGE = 5,
    LAYOUTCHANGE = 6,
    TEMPLATE = 7,
    DUPLICATE = 8,
    CREATEOBJECTOFTHISTYPE = 9,
  }

  export enum DataviewRestriction { 
    DVNONE = 0,
    DVRELATION = 1,
    DVCREATEOBJECT = 2,
    DVVIEWS = 3,
  }
}

export class Object extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Object.AsObject;
  static toObject(includeInstance: boolean, msg: Object): Object.AsObject;
  static serializeBinaryToWriter(message: Object, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Object;
  static deserializeBinaryFromReader(message: Object, reader: jspb.BinaryReader): Object;
}

export namespace Object {
  export type AsObject = {
  }

  export class ChangePayload extends jspb.Message {
    getSmartblocktype(): SmartBlockType;
    setSmartblocktype(value: SmartBlockType): ChangePayload;

    getKey(): string;
    setKey(value: string): ChangePayload;

    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): ChangePayload;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ChangePayload.AsObject;
    static toObject(includeInstance: boolean, msg: ChangePayload): ChangePayload.AsObject;
    static serializeBinaryToWriter(message: ChangePayload, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ChangePayload;
    static deserializeBinaryFromReader(message: ChangePayload, reader: jspb.BinaryReader): ChangePayload;
  }

  export namespace ChangePayload {
    export type AsObject = {
      smartblocktype: SmartBlockType,
      key: string,
      data: Uint8Array | string,
    }
  }

}

export class SpaceObjectHeader extends jspb.Message {
  getSpaceid(): string;
  setSpaceid(value: string): SpaceObjectHeader;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SpaceObjectHeader.AsObject;
  static toObject(includeInstance: boolean, msg: SpaceObjectHeader): SpaceObjectHeader.AsObject;
  static serializeBinaryToWriter(message: SpaceObjectHeader, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SpaceObjectHeader;
  static deserializeBinaryFromReader(message: SpaceObjectHeader, reader: jspb.BinaryReader): SpaceObjectHeader;
}

export namespace SpaceObjectHeader {
  export type AsObject = {
    spaceid: string,
  }
}

export class ObjectType extends jspb.Message {
  getUrl(): string;
  setUrl(value: string): ObjectType;

  getName(): string;
  setName(value: string): ObjectType;

  getRelationlinksList(): Array<RelationLink>;
  setRelationlinksList(value: Array<RelationLink>): ObjectType;
  clearRelationlinksList(): ObjectType;
  addRelationlinks(value?: RelationLink, index?: number): RelationLink;

  getLayout(): ObjectType.Layout;
  setLayout(value: ObjectType.Layout): ObjectType;

  getIconemoji(): string;
  setIconemoji(value: string): ObjectType;

  getDescription(): string;
  setDescription(value: string): ObjectType;

  getHidden(): boolean;
  setHidden(value: boolean): ObjectType;

  getReadonly(): boolean;
  setReadonly(value: boolean): ObjectType;

  getTypesList(): Array<SmartBlockType>;
  setTypesList(value: Array<SmartBlockType>): ObjectType;
  clearTypesList(): ObjectType;
  addTypes(value: SmartBlockType, index?: number): ObjectType;

  getIsarchived(): boolean;
  setIsarchived(value: boolean): ObjectType;

  getInstalledbydefault(): boolean;
  setInstalledbydefault(value: boolean): ObjectType;

  getKey(): string;
  setKey(value: string): ObjectType;

  getRevision(): number;
  setRevision(value: number): ObjectType;

  getRestrictobjectcreation(): boolean;
  setRestrictobjectcreation(value: boolean): ObjectType;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ObjectType.AsObject;
  static toObject(includeInstance: boolean, msg: ObjectType): ObjectType.AsObject;
  static serializeBinaryToWriter(message: ObjectType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ObjectType;
  static deserializeBinaryFromReader(message: ObjectType, reader: jspb.BinaryReader): ObjectType;
}

export namespace ObjectType {
  export type AsObject = {
    url: string,
    name: string,
    relationlinksList: Array<RelationLink.AsObject>,
    layout: ObjectType.Layout,
    iconemoji: string,
    description: string,
    hidden: boolean,
    readonly: boolean,
    typesList: Array<SmartBlockType>,
    isarchived: boolean,
    installedbydefault: boolean,
    key: string,
    revision: number,
    restrictobjectcreation: boolean,
  }

  export enum Layout { 
    BASIC = 0,
    PROFILE = 1,
    TODO = 2,
    SET = 3,
    OBJECTTYPE = 4,
    RELATION = 5,
    FILE = 6,
    DASHBOARD = 7,
    IMAGE = 8,
    NOTE = 9,
    SPACE = 10,
    BOOKMARK = 11,
    RELATIONOPTIONSLIST = 12,
    RELATIONOPTION = 13,
    COLLECTION = 14,
    AUDIO = 15,
    VIDEO = 16,
    DATE = 17,
    SPACEVIEW = 18,
    PARTICIPANT = 19,
    PDF = 20,
  }
}

export class Layout extends jspb.Message {
  getId(): ObjectType.Layout;
  setId(value: ObjectType.Layout): Layout;

  getName(): string;
  setName(value: string): Layout;

  getRequiredrelationsList(): Array<Relation>;
  setRequiredrelationsList(value: Array<Relation>): Layout;
  clearRequiredrelationsList(): Layout;
  addRequiredrelations(value?: Relation, index?: number): Relation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Layout.AsObject;
  static toObject(includeInstance: boolean, msg: Layout): Layout.AsObject;
  static serializeBinaryToWriter(message: Layout, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Layout;
  static deserializeBinaryFromReader(message: Layout, reader: jspb.BinaryReader): Layout;
}

export namespace Layout {
  export type AsObject = {
    id: ObjectType.Layout,
    name: string,
    requiredrelationsList: Array<Relation.AsObject>,
  }
}

export class RelationWithValue extends jspb.Message {
  getRelation(): Relation | undefined;
  setRelation(value?: Relation): RelationWithValue;
  hasRelation(): boolean;
  clearRelation(): RelationWithValue;

  getValue(): google_protobuf_struct_pb.Value | undefined;
  setValue(value?: google_protobuf_struct_pb.Value): RelationWithValue;
  hasValue(): boolean;
  clearValue(): RelationWithValue;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RelationWithValue.AsObject;
  static toObject(includeInstance: boolean, msg: RelationWithValue): RelationWithValue.AsObject;
  static serializeBinaryToWriter(message: RelationWithValue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RelationWithValue;
  static deserializeBinaryFromReader(message: RelationWithValue, reader: jspb.BinaryReader): RelationWithValue;
}

export namespace RelationWithValue {
  export type AsObject = {
    relation?: Relation.AsObject,
    value?: google_protobuf_struct_pb.Value.AsObject,
  }
}

export class Relation extends jspb.Message {
  getId(): string;
  setId(value: string): Relation;

  getKey(): string;
  setKey(value: string): Relation;

  getFormat(): RelationFormat;
  setFormat(value: RelationFormat): Relation;

  getName(): string;
  setName(value: string): Relation;

  getDefaultvalue(): google_protobuf_struct_pb.Value | undefined;
  setDefaultvalue(value?: google_protobuf_struct_pb.Value): Relation;
  hasDefaultvalue(): boolean;
  clearDefaultvalue(): Relation;

  getDatasource(): Relation.DataSource;
  setDatasource(value: Relation.DataSource): Relation;

  getHidden(): boolean;
  setHidden(value: boolean): Relation;

  getReadonly(): boolean;
  setReadonly(value: boolean): Relation;

  getReadonlyrelation(): boolean;
  setReadonlyrelation(value: boolean): Relation;

  getMulti(): boolean;
  setMulti(value: boolean): Relation;

  getObjecttypesList(): Array<string>;
  setObjecttypesList(value: Array<string>): Relation;
  clearObjecttypesList(): Relation;
  addObjecttypes(value: string, index?: number): Relation;

  getSelectdictList(): Array<Relation.Option>;
  setSelectdictList(value: Array<Relation.Option>): Relation;
  clearSelectdictList(): Relation;
  addSelectdict(value?: Relation.Option, index?: number): Relation.Option;

  getMaxcount(): number;
  setMaxcount(value: number): Relation;

  getDescription(): string;
  setDescription(value: string): Relation;

  getScope(): Relation.Scope;
  setScope(value: Relation.Scope): Relation;

  getCreator(): string;
  setCreator(value: string): Relation;

  getRevision(): number;
  setRevision(value: number): Relation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Relation.AsObject;
  static toObject(includeInstance: boolean, msg: Relation): Relation.AsObject;
  static serializeBinaryToWriter(message: Relation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Relation;
  static deserializeBinaryFromReader(message: Relation, reader: jspb.BinaryReader): Relation;
}

export namespace Relation {
  export type AsObject = {
    id: string,
    key: string,
    format: RelationFormat,
    name: string,
    defaultvalue?: google_protobuf_struct_pb.Value.AsObject,
    datasource: Relation.DataSource,
    hidden: boolean,
    readonly: boolean,
    readonlyrelation: boolean,
    multi: boolean,
    objecttypesList: Array<string>,
    selectdictList: Array<Relation.Option.AsObject>,
    maxcount: number,
    description: string,
    scope: Relation.Scope,
    creator: string,
    revision: number,
  }

  export class Option extends jspb.Message {
    getId(): string;
    setId(value: string): Option;

    getText(): string;
    setText(value: string): Option;

    getColor(): string;
    setColor(value: string): Option;

    getRelationkey(): string;
    setRelationkey(value: string): Option;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Option.AsObject;
    static toObject(includeInstance: boolean, msg: Option): Option.AsObject;
    static serializeBinaryToWriter(message: Option, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Option;
    static deserializeBinaryFromReader(message: Option, reader: jspb.BinaryReader): Option;
  }

  export namespace Option {
    export type AsObject = {
      id: string,
      text: string,
      color: string,
      relationkey: string,
    }
  }


  export enum Scope { 
    OBJECT = 0,
    TYPE = 1,
    SETOFTHESAMETYPE = 2,
    OBJECTSOFTHESAMETYPE = 3,
    LIBRARY = 4,
  }

  export enum DataSource { 
    DETAILS = 0,
    DERIVED = 1,
    ACCOUNT = 2,
    LOCAL = 3,
  }
}

export class RelationLink extends jspb.Message {
  getKey(): string;
  setKey(value: string): RelationLink;

  getFormat(): RelationFormat;
  setFormat(value: RelationFormat): RelationLink;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RelationLink.AsObject;
  static toObject(includeInstance: boolean, msg: RelationLink): RelationLink.AsObject;
  static serializeBinaryToWriter(message: RelationLink, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RelationLink;
  static deserializeBinaryFromReader(message: RelationLink, reader: jspb.BinaryReader): RelationLink;
}

export namespace RelationLink {
  export type AsObject = {
    key: string,
    format: RelationFormat,
  }
}

export class Relations extends jspb.Message {
  getRelationsList(): Array<Relation>;
  setRelationsList(value: Array<Relation>): Relations;
  clearRelationsList(): Relations;
  addRelations(value?: Relation, index?: number): Relation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Relations.AsObject;
  static toObject(includeInstance: boolean, msg: Relations): Relations.AsObject;
  static serializeBinaryToWriter(message: Relations, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Relations;
  static deserializeBinaryFromReader(message: Relations, reader: jspb.BinaryReader): Relations;
}

export namespace Relations {
  export type AsObject = {
    relationsList: Array<Relation.AsObject>,
  }
}

export class RelationOptions extends jspb.Message {
  getOptionsList(): Array<Relation.Option>;
  setOptionsList(value: Array<Relation.Option>): RelationOptions;
  clearOptionsList(): RelationOptions;
  addOptions(value?: Relation.Option, index?: number): Relation.Option;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RelationOptions.AsObject;
  static toObject(includeInstance: boolean, msg: RelationOptions): RelationOptions.AsObject;
  static serializeBinaryToWriter(message: RelationOptions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RelationOptions;
  static deserializeBinaryFromReader(message: RelationOptions, reader: jspb.BinaryReader): RelationOptions;
}

export namespace RelationOptions {
  export type AsObject = {
    optionsList: Array<Relation.Option.AsObject>,
  }
}

export class InternalFlag extends jspb.Message {
  getValue(): InternalFlag.Value;
  setValue(value: InternalFlag.Value): InternalFlag;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InternalFlag.AsObject;
  static toObject(includeInstance: boolean, msg: InternalFlag): InternalFlag.AsObject;
  static serializeBinaryToWriter(message: InternalFlag, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InternalFlag;
  static deserializeBinaryFromReader(message: InternalFlag, reader: jspb.BinaryReader): InternalFlag;
}

export namespace InternalFlag {
  export type AsObject = {
    value: InternalFlag.Value,
  }

  export enum Value { 
    EDITORDELETEEMPTY = 0,
    EDITORSELECTTYPE = 1,
    EDITORSELECTTEMPLATE = 2,
    COLLECTIONDONTINDEXLINKS = 3,
  }
}

export class ObjectView extends jspb.Message {
  getRootid(): string;
  setRootid(value: string): ObjectView;

  getBlocksList(): Array<Block>;
  setBlocksList(value: Array<Block>): ObjectView;
  clearBlocksList(): ObjectView;
  addBlocks(value?: Block, index?: number): Block;

  getDetailsList(): Array<ObjectView.DetailsSet>;
  setDetailsList(value: Array<ObjectView.DetailsSet>): ObjectView;
  clearDetailsList(): ObjectView;
  addDetails(value?: ObjectView.DetailsSet, index?: number): ObjectView.DetailsSet;

  getType(): SmartBlockType;
  setType(value: SmartBlockType): ObjectView;

  getRelationsList(): Array<Relation>;
  setRelationsList(value: Array<Relation>): ObjectView;
  clearRelationsList(): ObjectView;
  addRelations(value?: Relation, index?: number): Relation;

  getRelationlinksList(): Array<RelationLink>;
  setRelationlinksList(value: Array<RelationLink>): ObjectView;
  clearRelationlinksList(): ObjectView;
  addRelationlinks(value?: RelationLink, index?: number): RelationLink;

  getRestrictions(): Restrictions | undefined;
  setRestrictions(value?: Restrictions): ObjectView;
  hasRestrictions(): boolean;
  clearRestrictions(): ObjectView;

  getHistory(): ObjectView.HistorySize | undefined;
  setHistory(value?: ObjectView.HistorySize): ObjectView;
  hasHistory(): boolean;
  clearHistory(): ObjectView;

  getBlockparticipantsList(): Array<ObjectView.BlockParticipant>;
  setBlockparticipantsList(value: Array<ObjectView.BlockParticipant>): ObjectView;
  clearBlockparticipantsList(): ObjectView;
  addBlockparticipants(value?: ObjectView.BlockParticipant, index?: number): ObjectView.BlockParticipant;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ObjectView.AsObject;
  static toObject(includeInstance: boolean, msg: ObjectView): ObjectView.AsObject;
  static serializeBinaryToWriter(message: ObjectView, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ObjectView;
  static deserializeBinaryFromReader(message: ObjectView, reader: jspb.BinaryReader): ObjectView;
}

export namespace ObjectView {
  export type AsObject = {
    rootid: string,
    blocksList: Array<Block.AsObject>,
    detailsList: Array<ObjectView.DetailsSet.AsObject>,
    type: SmartBlockType,
    relationsList: Array<Relation.AsObject>,
    relationlinksList: Array<RelationLink.AsObject>,
    restrictions?: Restrictions.AsObject,
    history?: ObjectView.HistorySize.AsObject,
    blockparticipantsList: Array<ObjectView.BlockParticipant.AsObject>,
  }

  export class DetailsSet extends jspb.Message {
    getId(): string;
    setId(value: string): DetailsSet;

    getDetails(): google_protobuf_struct_pb.Struct | undefined;
    setDetails(value?: google_protobuf_struct_pb.Struct): DetailsSet;
    hasDetails(): boolean;
    clearDetails(): DetailsSet;

    getSubidsList(): Array<string>;
    setSubidsList(value: Array<string>): DetailsSet;
    clearSubidsList(): DetailsSet;
    addSubids(value: string, index?: number): DetailsSet;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DetailsSet.AsObject;
    static toObject(includeInstance: boolean, msg: DetailsSet): DetailsSet.AsObject;
    static serializeBinaryToWriter(message: DetailsSet, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DetailsSet;
    static deserializeBinaryFromReader(message: DetailsSet, reader: jspb.BinaryReader): DetailsSet;
  }

  export namespace DetailsSet {
    export type AsObject = {
      id: string,
      details?: google_protobuf_struct_pb.Struct.AsObject,
      subidsList: Array<string>,
    }
  }


  export class RelationWithValuePerObject extends jspb.Message {
    getObjectid(): string;
    setObjectid(value: string): RelationWithValuePerObject;

    getRelationsList(): Array<RelationWithValue>;
    setRelationsList(value: Array<RelationWithValue>): RelationWithValuePerObject;
    clearRelationsList(): RelationWithValuePerObject;
    addRelations(value?: RelationWithValue, index?: number): RelationWithValue;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RelationWithValuePerObject.AsObject;
    static toObject(includeInstance: boolean, msg: RelationWithValuePerObject): RelationWithValuePerObject.AsObject;
    static serializeBinaryToWriter(message: RelationWithValuePerObject, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RelationWithValuePerObject;
    static deserializeBinaryFromReader(message: RelationWithValuePerObject, reader: jspb.BinaryReader): RelationWithValuePerObject;
  }

  export namespace RelationWithValuePerObject {
    export type AsObject = {
      objectid: string,
      relationsList: Array<RelationWithValue.AsObject>,
    }
  }


  export class HistorySize extends jspb.Message {
    getUndo(): number;
    setUndo(value: number): HistorySize;

    getRedo(): number;
    setRedo(value: number): HistorySize;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HistorySize.AsObject;
    static toObject(includeInstance: boolean, msg: HistorySize): HistorySize.AsObject;
    static serializeBinaryToWriter(message: HistorySize, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HistorySize;
    static deserializeBinaryFromReader(message: HistorySize, reader: jspb.BinaryReader): HistorySize;
  }

  export namespace HistorySize {
    export type AsObject = {
      undo: number,
      redo: number,
    }
  }


  export class BlockParticipant extends jspb.Message {
    getBlockid(): string;
    setBlockid(value: string): BlockParticipant;

    getParticipantid(): string;
    setParticipantid(value: string): BlockParticipant;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BlockParticipant.AsObject;
    static toObject(includeInstance: boolean, msg: BlockParticipant): BlockParticipant.AsObject;
    static serializeBinaryToWriter(message: BlockParticipant, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BlockParticipant;
    static deserializeBinaryFromReader(message: BlockParticipant, reader: jspb.BinaryReader): BlockParticipant;
  }

  export namespace BlockParticipant {
    export type AsObject = {
      blockid: string,
      participantid: string,
    }
  }

}

export class ParticipantPermissionChange extends jspb.Message {
  getIdentity(): string;
  setIdentity(value: string): ParticipantPermissionChange;

  getPerms(): ParticipantPermissions;
  setPerms(value: ParticipantPermissions): ParticipantPermissionChange;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParticipantPermissionChange.AsObject;
  static toObject(includeInstance: boolean, msg: ParticipantPermissionChange): ParticipantPermissionChange.AsObject;
  static serializeBinaryToWriter(message: ParticipantPermissionChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParticipantPermissionChange;
  static deserializeBinaryFromReader(message: ParticipantPermissionChange, reader: jspb.BinaryReader): ParticipantPermissionChange;
}

export namespace ParticipantPermissionChange {
  export type AsObject = {
    identity: string,
    perms: ParticipantPermissions,
  }
}

export class Metadata extends jspb.Message {
  getIdentity(): Metadata.Payload.IdentityPayload | undefined;
  setIdentity(value?: Metadata.Payload.IdentityPayload): Metadata;
  hasIdentity(): boolean;
  clearIdentity(): Metadata;

  getPayloadCase(): Metadata.PayloadCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Metadata.AsObject;
  static toObject(includeInstance: boolean, msg: Metadata): Metadata.AsObject;
  static serializeBinaryToWriter(message: Metadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Metadata;
  static deserializeBinaryFromReader(message: Metadata, reader: jspb.BinaryReader): Metadata;
}

export namespace Metadata {
  export type AsObject = {
    identity?: Metadata.Payload.IdentityPayload.AsObject,
  }

  export class Payload extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Payload.AsObject;
    static toObject(includeInstance: boolean, msg: Payload): Payload.AsObject;
    static serializeBinaryToWriter(message: Payload, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Payload;
    static deserializeBinaryFromReader(message: Payload, reader: jspb.BinaryReader): Payload;
  }

  export namespace Payload {
    export type AsObject = {
    }

    export class IdentityPayload extends jspb.Message {
      getProfilesymkey(): Uint8Array | string;
      getProfilesymkey_asU8(): Uint8Array;
      getProfilesymkey_asB64(): string;
      setProfilesymkey(value: Uint8Array | string): IdentityPayload;

      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): IdentityPayload.AsObject;
      static toObject(includeInstance: boolean, msg: IdentityPayload): IdentityPayload.AsObject;
      static serializeBinaryToWriter(message: IdentityPayload, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): IdentityPayload;
      static deserializeBinaryFromReader(message: IdentityPayload, reader: jspb.BinaryReader): IdentityPayload;
    }

    export namespace IdentityPayload {
      export type AsObject = {
        profilesymkey: Uint8Array | string,
      }
    }

  }


  export enum PayloadCase { 
    PAYLOAD_NOT_SET = 0,
    IDENTITY = 1,
  }
}

export class Notification extends jspb.Message {
  getId(): string;
  setId(value: string): Notification;

  getCreatetime(): number;
  setCreatetime(value: number): Notification;

  getStatus(): Notification.Status;
  setStatus(value: Notification.Status): Notification;

  getIslocal(): boolean;
  setIslocal(value: boolean): Notification;

  getImport(): Notification.Import | undefined;
  setImport(value?: Notification.Import): Notification;
  hasImport(): boolean;
  clearImport(): Notification;

  getExport(): Notification.Export | undefined;
  setExport(value?: Notification.Export): Notification;
  hasExport(): boolean;
  clearExport(): Notification;

  getGalleryimport(): Notification.GalleryImport | undefined;
  setGalleryimport(value?: Notification.GalleryImport): Notification;
  hasGalleryimport(): boolean;
  clearGalleryimport(): Notification;

  getRequesttojoin(): Notification.RequestToJoin | undefined;
  setRequesttojoin(value?: Notification.RequestToJoin): Notification;
  hasRequesttojoin(): boolean;
  clearRequesttojoin(): Notification;

  getTest(): Notification.Test | undefined;
  setTest(value?: Notification.Test): Notification;
  hasTest(): boolean;
  clearTest(): Notification;

  getParticipantrequestapproved(): Notification.ParticipantRequestApproved | undefined;
  setParticipantrequestapproved(value?: Notification.ParticipantRequestApproved): Notification;
  hasParticipantrequestapproved(): boolean;
  clearParticipantrequestapproved(): Notification;

  getRequesttoleave(): Notification.RequestToLeave | undefined;
  setRequesttoleave(value?: Notification.RequestToLeave): Notification;
  hasRequesttoleave(): boolean;
  clearRequesttoleave(): Notification;

  getParticipantremove(): Notification.ParticipantRemove | undefined;
  setParticipantremove(value?: Notification.ParticipantRemove): Notification;
  hasParticipantremove(): boolean;
  clearParticipantremove(): Notification;

  getParticipantrequestdecline(): Notification.ParticipantRequestDecline | undefined;
  setParticipantrequestdecline(value?: Notification.ParticipantRequestDecline): Notification;
  hasParticipantrequestdecline(): boolean;
  clearParticipantrequestdecline(): Notification;

  getParticipantpermissionschange(): Notification.ParticipantPermissionsChange | undefined;
  setParticipantpermissionschange(value?: Notification.ParticipantPermissionsChange): Notification;
  hasParticipantpermissionschange(): boolean;
  clearParticipantpermissionschange(): Notification;

  getSpace(): string;
  setSpace(value: string): Notification;

  getAclheadid(): string;
  setAclheadid(value: string): Notification;

  getPayloadCase(): Notification.PayloadCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Notification.AsObject;
  static toObject(includeInstance: boolean, msg: Notification): Notification.AsObject;
  static serializeBinaryToWriter(message: Notification, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Notification;
  static deserializeBinaryFromReader(message: Notification, reader: jspb.BinaryReader): Notification;
}

export namespace Notification {
  export type AsObject = {
    id: string,
    createtime: number,
    status: Notification.Status,
    islocal: boolean,
    pb_import?: Notification.Import.AsObject,
    pb_export?: Notification.Export.AsObject,
    galleryimport?: Notification.GalleryImport.AsObject,
    requesttojoin?: Notification.RequestToJoin.AsObject,
    test?: Notification.Test.AsObject,
    participantrequestapproved?: Notification.ParticipantRequestApproved.AsObject,
    requesttoleave?: Notification.RequestToLeave.AsObject,
    participantremove?: Notification.ParticipantRemove.AsObject,
    participantrequestdecline?: Notification.ParticipantRequestDecline.AsObject,
    participantpermissionschange?: Notification.ParticipantPermissionsChange.AsObject,
    space: string,
    aclheadid: string,
  }

  export class Import extends jspb.Message {
    getProcessid(): string;
    setProcessid(value: string): Import;

    getErrorcode(): Import.ErrorCode;
    setErrorcode(value: Import.ErrorCode): Import;

    getImporttype(): Import.Type;
    setImporttype(value: Import.Type): Import;

    getSpaceid(): string;
    setSpaceid(value: string): Import;

    getName(): string;
    setName(value: string): Import;

    getSpacename(): string;
    setSpacename(value: string): Import;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Import.AsObject;
    static toObject(includeInstance: boolean, msg: Import): Import.AsObject;
    static serializeBinaryToWriter(message: Import, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Import;
    static deserializeBinaryFromReader(message: Import, reader: jspb.BinaryReader): Import;
  }

  export namespace Import {
    export type AsObject = {
      processid: string,
      errorcode: Import.ErrorCode,
      importtype: Import.Type,
      spaceid: string,
      name: string,
      spacename: string,
    }
  }


  export class Export extends jspb.Message {
    getErrorcode(): Notification.Export.Code;
    setErrorcode(value: Notification.Export.Code): Export;

    getExporttype(): Export.Format;
    setExporttype(value: Export.Format): Export;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Export.AsObject;
    static toObject(includeInstance: boolean, msg: Export): Export.AsObject;
    static serializeBinaryToWriter(message: Export, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Export;
    static deserializeBinaryFromReader(message: Export, reader: jspb.BinaryReader): Export;
  }

  export namespace Export {
    export type AsObject = {
      errorcode: Notification.Export.Code,
      exporttype: Export.Format,
    }

    export enum Code { 
      NULL = 0,
      UNKNOWN_ERROR = 1,
      BAD_INPUT = 2,
    }
  }


  export class GalleryImport extends jspb.Message {
    getProcessid(): string;
    setProcessid(value: string): GalleryImport;

    getErrorcode(): Import.ErrorCode;
    setErrorcode(value: Import.ErrorCode): GalleryImport;

    getSpaceid(): string;
    setSpaceid(value: string): GalleryImport;

    getName(): string;
    setName(value: string): GalleryImport;

    getSpacename(): string;
    setSpacename(value: string): GalleryImport;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GalleryImport.AsObject;
    static toObject(includeInstance: boolean, msg: GalleryImport): GalleryImport.AsObject;
    static serializeBinaryToWriter(message: GalleryImport, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GalleryImport;
    static deserializeBinaryFromReader(message: GalleryImport, reader: jspb.BinaryReader): GalleryImport;
  }

  export namespace GalleryImport {
    export type AsObject = {
      processid: string,
      errorcode: Import.ErrorCode,
      spaceid: string,
      name: string,
      spacename: string,
    }
  }


  export class RequestToJoin extends jspb.Message {
    getSpaceid(): string;
    setSpaceid(value: string): RequestToJoin;

    getIdentity(): string;
    setIdentity(value: string): RequestToJoin;

    getIdentityname(): string;
    setIdentityname(value: string): RequestToJoin;

    getIdentityicon(): string;
    setIdentityicon(value: string): RequestToJoin;

    getSpacename(): string;
    setSpacename(value: string): RequestToJoin;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RequestToJoin.AsObject;
    static toObject(includeInstance: boolean, msg: RequestToJoin): RequestToJoin.AsObject;
    static serializeBinaryToWriter(message: RequestToJoin, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RequestToJoin;
    static deserializeBinaryFromReader(message: RequestToJoin, reader: jspb.BinaryReader): RequestToJoin;
  }

  export namespace RequestToJoin {
    export type AsObject = {
      spaceid: string,
      identity: string,
      identityname: string,
      identityicon: string,
      spacename: string,
    }
  }


  export class Test extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Test.AsObject;
    static toObject(includeInstance: boolean, msg: Test): Test.AsObject;
    static serializeBinaryToWriter(message: Test, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Test;
    static deserializeBinaryFromReader(message: Test, reader: jspb.BinaryReader): Test;
  }

  export namespace Test {
    export type AsObject = {
    }
  }


  export class ParticipantRequestApproved extends jspb.Message {
    getSpaceid(): string;
    setSpaceid(value: string): ParticipantRequestApproved;

    getPermissions(): ParticipantPermissions;
    setPermissions(value: ParticipantPermissions): ParticipantRequestApproved;

    getSpacename(): string;
    setSpacename(value: string): ParticipantRequestApproved;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ParticipantRequestApproved.AsObject;
    static toObject(includeInstance: boolean, msg: ParticipantRequestApproved): ParticipantRequestApproved.AsObject;
    static serializeBinaryToWriter(message: ParticipantRequestApproved, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ParticipantRequestApproved;
    static deserializeBinaryFromReader(message: ParticipantRequestApproved, reader: jspb.BinaryReader): ParticipantRequestApproved;
  }

  export namespace ParticipantRequestApproved {
    export type AsObject = {
      spaceid: string,
      permissions: ParticipantPermissions,
      spacename: string,
    }
  }


  export class RequestToLeave extends jspb.Message {
    getSpaceid(): string;
    setSpaceid(value: string): RequestToLeave;

    getIdentity(): string;
    setIdentity(value: string): RequestToLeave;

    getIdentityname(): string;
    setIdentityname(value: string): RequestToLeave;

    getIdentityicon(): string;
    setIdentityicon(value: string): RequestToLeave;

    getSpacename(): string;
    setSpacename(value: string): RequestToLeave;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RequestToLeave.AsObject;
    static toObject(includeInstance: boolean, msg: RequestToLeave): RequestToLeave.AsObject;
    static serializeBinaryToWriter(message: RequestToLeave, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RequestToLeave;
    static deserializeBinaryFromReader(message: RequestToLeave, reader: jspb.BinaryReader): RequestToLeave;
  }

  export namespace RequestToLeave {
    export type AsObject = {
      spaceid: string,
      identity: string,
      identityname: string,
      identityicon: string,
      spacename: string,
    }
  }


  export class ParticipantRemove extends jspb.Message {
    getIdentity(): string;
    setIdentity(value: string): ParticipantRemove;

    getIdentityname(): string;
    setIdentityname(value: string): ParticipantRemove;

    getIdentityicon(): string;
    setIdentityicon(value: string): ParticipantRemove;

    getSpaceid(): string;
    setSpaceid(value: string): ParticipantRemove;

    getSpacename(): string;
    setSpacename(value: string): ParticipantRemove;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ParticipantRemove.AsObject;
    static toObject(includeInstance: boolean, msg: ParticipantRemove): ParticipantRemove.AsObject;
    static serializeBinaryToWriter(message: ParticipantRemove, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ParticipantRemove;
    static deserializeBinaryFromReader(message: ParticipantRemove, reader: jspb.BinaryReader): ParticipantRemove;
  }

  export namespace ParticipantRemove {
    export type AsObject = {
      identity: string,
      identityname: string,
      identityicon: string,
      spaceid: string,
      spacename: string,
    }
  }


  export class ParticipantRequestDecline extends jspb.Message {
    getSpaceid(): string;
    setSpaceid(value: string): ParticipantRequestDecline;

    getSpacename(): string;
    setSpacename(value: string): ParticipantRequestDecline;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ParticipantRequestDecline.AsObject;
    static toObject(includeInstance: boolean, msg: ParticipantRequestDecline): ParticipantRequestDecline.AsObject;
    static serializeBinaryToWriter(message: ParticipantRequestDecline, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ParticipantRequestDecline;
    static deserializeBinaryFromReader(message: ParticipantRequestDecline, reader: jspb.BinaryReader): ParticipantRequestDecline;
  }

  export namespace ParticipantRequestDecline {
    export type AsObject = {
      spaceid: string,
      spacename: string,
    }
  }


  export class ParticipantPermissionsChange extends jspb.Message {
    getSpaceid(): string;
    setSpaceid(value: string): ParticipantPermissionsChange;

    getPermissions(): ParticipantPermissions;
    setPermissions(value: ParticipantPermissions): ParticipantPermissionsChange;

    getSpacename(): string;
    setSpacename(value: string): ParticipantPermissionsChange;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ParticipantPermissionsChange.AsObject;
    static toObject(includeInstance: boolean, msg: ParticipantPermissionsChange): ParticipantPermissionsChange.AsObject;
    static serializeBinaryToWriter(message: ParticipantPermissionsChange, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ParticipantPermissionsChange;
    static deserializeBinaryFromReader(message: ParticipantPermissionsChange, reader: jspb.BinaryReader): ParticipantPermissionsChange;
  }

  export namespace ParticipantPermissionsChange {
    export type AsObject = {
      spaceid: string,
      permissions: ParticipantPermissions,
      spacename: string,
    }
  }


  export enum Status { 
    CREATED = 0,
    SHOWN = 1,
    READ = 2,
    REPLIED = 3,
  }

  export enum ActionType { 
    CLOSE = 0,
  }

  export enum PayloadCase { 
    PAYLOAD_NOT_SET = 0,
    IMPORT = 6,
    EXPORT = 8,
    GALLERYIMPORT = 9,
    REQUESTTOJOIN = 10,
    TEST = 11,
    PARTICIPANTREQUESTAPPROVED = 13,
    REQUESTTOLEAVE = 15,
    PARTICIPANTREMOVE = 16,
    PARTICIPANTREQUESTDECLINE = 17,
    PARTICIPANTPERMISSIONSCHANGE = 18,
  }
}

export class Export extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Export.AsObject;
  static toObject(includeInstance: boolean, msg: Export): Export.AsObject;
  static serializeBinaryToWriter(message: Export, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Export;
  static deserializeBinaryFromReader(message: Export, reader: jspb.BinaryReader): Export;
}

export namespace Export {
  export type AsObject = {
  }

  export enum Format { 
    MARKDOWN = 0,
    PROTOBUF = 1,
    JSON = 2,
    DOT = 3,
    SVG = 4,
    GRAPH_JSON = 5,
  }
}

export class Import extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Import.AsObject;
  static toObject(includeInstance: boolean, msg: Import): Import.AsObject;
  static serializeBinaryToWriter(message: Import, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Import;
  static deserializeBinaryFromReader(message: Import, reader: jspb.BinaryReader): Import;
}

export namespace Import {
  export type AsObject = {
  }

  export enum Type { 
    NOTION = 0,
    MARKDOWN = 1,
    EXTERNAL = 2,
    PB = 3,
    HTML = 4,
    TXT = 5,
    CSV = 6,
  }

  export enum ErrorCode { 
    NULL = 0,
    UNKNOWN_ERROR = 1,
    BAD_INPUT = 2,
    INTERNAL_ERROR = 3,
    NO_OBJECTS_TO_IMPORT = 5,
    IMPORT_IS_CANCELED = 6,
    LIMIT_OF_ROWS_OR_RELATIONS_EXCEEDED = 7,
    FILE_LOAD_ERROR = 8,
    INSUFFICIENT_PERMISSIONS = 9,
  }
}

export class Invite extends jspb.Message {
  getPayload(): Uint8Array | string;
  getPayload_asU8(): Uint8Array;
  getPayload_asB64(): string;
  setPayload(value: Uint8Array | string): Invite;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): Invite;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Invite.AsObject;
  static toObject(includeInstance: boolean, msg: Invite): Invite.AsObject;
  static serializeBinaryToWriter(message: Invite, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Invite;
  static deserializeBinaryFromReader(message: Invite, reader: jspb.BinaryReader): Invite;
}

export namespace Invite {
  export type AsObject = {
    payload: Uint8Array | string,
    signature: Uint8Array | string,
  }
}

export class InvitePayload extends jspb.Message {
  getCreatoridentity(): string;
  setCreatoridentity(value: string): InvitePayload;

  getCreatorname(): string;
  setCreatorname(value: string): InvitePayload;

  getInvitekey(): Uint8Array | string;
  getInvitekey_asU8(): Uint8Array;
  getInvitekey_asB64(): string;
  setInvitekey(value: Uint8Array | string): InvitePayload;

  getSpaceid(): string;
  setSpaceid(value: string): InvitePayload;

  getSpacename(): string;
  setSpacename(value: string): InvitePayload;

  getSpaceiconcid(): string;
  setSpaceiconcid(value: string): InvitePayload;

  getSpaceiconencryptionkeysList(): Array<FileEncryptionKey>;
  setSpaceiconencryptionkeysList(value: Array<FileEncryptionKey>): InvitePayload;
  clearSpaceiconencryptionkeysList(): InvitePayload;
  addSpaceiconencryptionkeys(value?: FileEncryptionKey, index?: number): FileEncryptionKey;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InvitePayload.AsObject;
  static toObject(includeInstance: boolean, msg: InvitePayload): InvitePayload.AsObject;
  static serializeBinaryToWriter(message: InvitePayload, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InvitePayload;
  static deserializeBinaryFromReader(message: InvitePayload, reader: jspb.BinaryReader): InvitePayload;
}

export namespace InvitePayload {
  export type AsObject = {
    creatoridentity: string,
    creatorname: string,
    invitekey: Uint8Array | string,
    spaceid: string,
    spacename: string,
    spaceiconcid: string,
    spaceiconencryptionkeysList: Array<FileEncryptionKey.AsObject>,
  }
}

export class IdentityProfile extends jspb.Message {
  getIdentity(): string;
  setIdentity(value: string): IdentityProfile;

  getName(): string;
  setName(value: string): IdentityProfile;

  getIconcid(): string;
  setIconcid(value: string): IdentityProfile;

  getIconencryptionkeysList(): Array<FileEncryptionKey>;
  setIconencryptionkeysList(value: Array<FileEncryptionKey>): IdentityProfile;
  clearIconencryptionkeysList(): IdentityProfile;
  addIconencryptionkeys(value?: FileEncryptionKey, index?: number): FileEncryptionKey;

  getDescription(): string;
  setDescription(value: string): IdentityProfile;

  getGlobalname(): string;
  setGlobalname(value: string): IdentityProfile;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IdentityProfile.AsObject;
  static toObject(includeInstance: boolean, msg: IdentityProfile): IdentityProfile.AsObject;
  static serializeBinaryToWriter(message: IdentityProfile, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IdentityProfile;
  static deserializeBinaryFromReader(message: IdentityProfile, reader: jspb.BinaryReader): IdentityProfile;
}

export namespace IdentityProfile {
  export type AsObject = {
    identity: string,
    name: string,
    iconcid: string,
    iconencryptionkeysList: Array<FileEncryptionKey.AsObject>,
    description: string,
    globalname: string,
  }
}

export class FileInfo extends jspb.Message {
  getFileid(): string;
  setFileid(value: string): FileInfo;

  getEncryptionkeysList(): Array<FileEncryptionKey>;
  setEncryptionkeysList(value: Array<FileEncryptionKey>): FileInfo;
  clearEncryptionkeysList(): FileInfo;
  addEncryptionkeys(value?: FileEncryptionKey, index?: number): FileEncryptionKey;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FileInfo.AsObject;
  static toObject(includeInstance: boolean, msg: FileInfo): FileInfo.AsObject;
  static serializeBinaryToWriter(message: FileInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FileInfo;
  static deserializeBinaryFromReader(message: FileInfo, reader: jspb.BinaryReader): FileInfo;
}

export namespace FileInfo {
  export type AsObject = {
    fileid: string,
    encryptionkeysList: Array<FileEncryptionKey.AsObject>,
  }
}

export class FileEncryptionKey extends jspb.Message {
  getPath(): string;
  setPath(value: string): FileEncryptionKey;

  getKey(): string;
  setKey(value: string): FileEncryptionKey;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FileEncryptionKey.AsObject;
  static toObject(includeInstance: boolean, msg: FileEncryptionKey): FileEncryptionKey.AsObject;
  static serializeBinaryToWriter(message: FileEncryptionKey, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FileEncryptionKey;
  static deserializeBinaryFromReader(message: FileEncryptionKey, reader: jspb.BinaryReader): FileEncryptionKey;
}

export namespace FileEncryptionKey {
  export type AsObject = {
    path: string,
    key: string,
  }
}

export class ManifestInfo extends jspb.Message {
  getSchema(): string;
  setSchema(value: string): ManifestInfo;

  getId(): string;
  setId(value: string): ManifestInfo;

  getName(): string;
  setName(value: string): ManifestInfo;

  getAuthor(): string;
  setAuthor(value: string): ManifestInfo;

  getLicense(): string;
  setLicense(value: string): ManifestInfo;

  getTitle(): string;
  setTitle(value: string): ManifestInfo;

  getDescription(): string;
  setDescription(value: string): ManifestInfo;

  getScreenshotsList(): Array<string>;
  setScreenshotsList(value: Array<string>): ManifestInfo;
  clearScreenshotsList(): ManifestInfo;
  addScreenshots(value: string, index?: number): ManifestInfo;

  getDownloadlink(): string;
  setDownloadlink(value: string): ManifestInfo;

  getFilesize(): number;
  setFilesize(value: number): ManifestInfo;

  getCategoriesList(): Array<string>;
  setCategoriesList(value: Array<string>): ManifestInfo;
  clearCategoriesList(): ManifestInfo;
  addCategories(value: string, index?: number): ManifestInfo;

  getLanguage(): string;
  setLanguage(value: string): ManifestInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ManifestInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ManifestInfo): ManifestInfo.AsObject;
  static serializeBinaryToWriter(message: ManifestInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ManifestInfo;
  static deserializeBinaryFromReader(message: ManifestInfo, reader: jspb.BinaryReader): ManifestInfo;
}

export namespace ManifestInfo {
  export type AsObject = {
    schema: string,
    id: string,
    name: string,
    author: string,
    license: string,
    title: string,
    description: string,
    screenshotsList: Array<string>,
    downloadlink: string,
    filesize: number,
    categoriesList: Array<string>,
    language: string,
  }
}

export class Membership extends jspb.Message {
  getTier(): number;
  setTier(value: number): Membership;

  getStatus(): Membership.Status;
  setStatus(value: Membership.Status): Membership;

  getDatestarted(): number;
  setDatestarted(value: number): Membership;

  getDateends(): number;
  setDateends(value: number): Membership;

  getIsautorenew(): boolean;
  setIsautorenew(value: boolean): Membership;

  getPaymentmethod(): Membership.PaymentMethod;
  setPaymentmethod(value: Membership.PaymentMethod): Membership;

  getNsname(): string;
  setNsname(value: string): Membership;

  getNsnametype(): NameserviceNameType;
  setNsnametype(value: NameserviceNameType): Membership;

  getUseremail(): string;
  setUseremail(value: string): Membership;

  getSubscribetonewsletter(): boolean;
  setSubscribetonewsletter(value: boolean): Membership;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Membership.AsObject;
  static toObject(includeInstance: boolean, msg: Membership): Membership.AsObject;
  static serializeBinaryToWriter(message: Membership, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Membership;
  static deserializeBinaryFromReader(message: Membership, reader: jspb.BinaryReader): Membership;
}

export namespace Membership {
  export type AsObject = {
    tier: number,
    status: Membership.Status,
    datestarted: number,
    dateends: number,
    isautorenew: boolean,
    paymentmethod: Membership.PaymentMethod,
    nsname: string,
    nsnametype: NameserviceNameType,
    useremail: string,
    subscribetonewsletter: boolean,
  }

  export enum Status { 
    STATUSUNKNOWN = 0,
    STATUSPENDING = 1,
    STATUSACTIVE = 2,
    STATUSPENDINGREQUIRESFINALIZATION = 3,
  }

  export enum PaymentMethod { 
    METHODNONE = 0,
    METHODSTRIPE = 1,
    METHODCRYPTO = 2,
    METHODINAPPAPPLE = 3,
    METHODINAPPGOOGLE = 4,
  }

  export enum EmailVerificationStatus { 
    STATUSNOTVERIFIED = 0,
    STATUSCODESENT = 1,
    STATUSVERIFIED = 2,
  }
}

export class MembershipTierData extends jspb.Message {
  getId(): number;
  setId(value: number): MembershipTierData;

  getName(): string;
  setName(value: string): MembershipTierData;

  getDescription(): string;
  setDescription(value: string): MembershipTierData;

  getIstest(): boolean;
  setIstest(value: boolean): MembershipTierData;

  getPeriodtype(): MembershipTierData.PeriodType;
  setPeriodtype(value: MembershipTierData.PeriodType): MembershipTierData;

  getPeriodvalue(): number;
  setPeriodvalue(value: number): MembershipTierData;

  getPricestripeusdcents(): number;
  setPricestripeusdcents(value: number): MembershipTierData;

  getAnynamescountincluded(): number;
  setAnynamescountincluded(value: number): MembershipTierData;

  getAnynameminlength(): number;
  setAnynameminlength(value: number): MembershipTierData;

  getFeaturesList(): Array<string>;
  setFeaturesList(value: Array<string>): MembershipTierData;
  clearFeaturesList(): MembershipTierData;
  addFeatures(value: string, index?: number): MembershipTierData;

  getColorstr(): string;
  setColorstr(value: string): MembershipTierData;

  getStripeproductid(): string;
  setStripeproductid(value: string): MembershipTierData;

  getStripemanageurl(): string;
  setStripemanageurl(value: string): MembershipTierData;

  getIosproductid(): string;
  setIosproductid(value: string): MembershipTierData;

  getIosmanageurl(): string;
  setIosmanageurl(value: string): MembershipTierData;

  getAndroidproductid(): string;
  setAndroidproductid(value: string): MembershipTierData;

  getAndroidmanageurl(): string;
  setAndroidmanageurl(value: string): MembershipTierData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MembershipTierData.AsObject;
  static toObject(includeInstance: boolean, msg: MembershipTierData): MembershipTierData.AsObject;
  static serializeBinaryToWriter(message: MembershipTierData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MembershipTierData;
  static deserializeBinaryFromReader(message: MembershipTierData, reader: jspb.BinaryReader): MembershipTierData;
}

export namespace MembershipTierData {
  export type AsObject = {
    id: number,
    name: string,
    description: string,
    istest: boolean,
    periodtype: MembershipTierData.PeriodType,
    periodvalue: number,
    pricestripeusdcents: number,
    anynamescountincluded: number,
    anynameminlength: number,
    featuresList: Array<string>,
    colorstr: string,
    stripeproductid: string,
    stripemanageurl: string,
    iosproductid: string,
    iosmanageurl: string,
    androidproductid: string,
    androidmanageurl: string,
  }

  export enum PeriodType { 
    PERIODTYPEUNKNOWN = 0,
    PERIODTYPEUNLIMITED = 1,
    PERIODTYPEDAYS = 2,
    PERIODTYPEWEEKS = 3,
    PERIODTYPEMONTHS = 4,
    PERIODTYPEYEARS = 5,
  }
}

export class Detail extends jspb.Message {
  getKey(): string;
  setKey(value: string): Detail;

  getValue(): google_protobuf_struct_pb.Value | undefined;
  setValue(value?: google_protobuf_struct_pb.Value): Detail;
  hasValue(): boolean;
  clearValue(): Detail;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Detail.AsObject;
  static toObject(includeInstance: boolean, msg: Detail): Detail.AsObject;
  static serializeBinaryToWriter(message: Detail, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Detail;
  static deserializeBinaryFromReader(message: Detail, reader: jspb.BinaryReader): Detail;
}

export namespace Detail {
  export type AsObject = {
    key: string,
    value?: google_protobuf_struct_pb.Value.AsObject,
  }
}

export class DeviceInfo extends jspb.Message {
  getId(): string;
  setId(value: string): DeviceInfo;

  getName(): string;
  setName(value: string): DeviceInfo;

  getAdddate(): number;
  setAdddate(value: number): DeviceInfo;

  getArchived(): boolean;
  setArchived(value: boolean): DeviceInfo;

  getIsconnected(): boolean;
  setIsconnected(value: boolean): DeviceInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeviceInfo.AsObject;
  static toObject(includeInstance: boolean, msg: DeviceInfo): DeviceInfo.AsObject;
  static serializeBinaryToWriter(message: DeviceInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeviceInfo;
  static deserializeBinaryFromReader(message: DeviceInfo, reader: jspb.BinaryReader): DeviceInfo;
}

export namespace DeviceInfo {
  export type AsObject = {
    id: string,
    name: string,
    adddate: number,
    archived: boolean,
    isconnected: boolean,
  }
}

export enum SmartBlockType { 
  ACCOUNTOLD = 0,
  PAGE = 16,
  PROFILEPAGE = 17,
  HOME = 32,
  ARCHIVE = 48,
  WIDGET = 112,
  FILE = 256,
  TEMPLATE = 288,
  BUNDLEDTEMPLATE = 289,
  BUNDLEDRELATION = 512,
  SUBOBJECT = 513,
  BUNDLEDOBJECTTYPE = 514,
  ANYTYPEPROFILE = 515,
  DATE = 516,
  WORKSPACE = 518,
  STRELATION = 521,
  STTYPE = 528,
  STRELATIONOPTION = 529,
  SPACEVIEW = 530,
  IDENTITY = 532,
  PARTICIPANT = 534,
  MISSINGOBJECT = 519,
  FILEOBJECT = 533,
  NOTIFICATIONOBJECT = 535,
  DEVICESOBJECT = 536,
}
export enum RelationFormat { 
  LONGTEXT = 0,
  SHORTTEXT = 1,
  NUMBER = 2,
  STATUS = 3,
  TAG = 11,
  DATE = 4,
  FILE = 5,
  CHECKBOX = 6,
  URL = 7,
  EMAIL = 8,
  PHONE = 9,
  EMOJI = 10,
  OBJECT = 100,
  RELATIONS = 101,
}
export enum ObjectOrigin { 
  NONE = 0,
  CLIPBOARD = 1,
  DRAGANDDROP = 2,
  IMPORT = 3,
  WEBCLIPPER = 4,
  SHARINGEXTENSION = 5,
  USECASE = 6,
  BUILTIN = 7,
  BOOKMARK = 8,
}
export enum SpaceStatus { 
  UNKNOWN = 0,
  LOADING = 1,
  OK = 2,
  MISSING = 3,
  ERROR = 4,
  REMOTEWAITINGDELETION = 5,
  REMOTEDELETED = 6,
  SPACEDELETED = 7,
  SPACEACTIVE = 8,
  SPACEJOINING = 9,
  SPACEREMOVING = 10,
}
export enum ParticipantPermissions { 
  READER = 0,
  WRITER = 1,
  OWNER = 2,
  NOPERMISSIONS = 3,
}
export enum ParticipantStatus { 
  JOINING = 0,
  ACTIVE = 1,
  REMOVED = 2,
  DECLINED = 3,
  REMOVING = 4,
  CANCELED = 5,
}
export enum SpaceAccessType { 
  PRIVATE = 0,
  PERSONAL = 1,
  SHARED = 2,
}
export enum ImageKind { 
  BASIC = 0,
  COVER = 1,
  ICON = 2,
}
export enum FileIndexingStatus { 
  NOTINDEXED = 0,
  INDEXED = 1,
  NOTFOUND = 2,
}
export enum SpaceShareableStatus { 
  STATUSUNKNOWN = 0,
  STATUSSHAREABLE = 1,
  STATUSNOTSHAREABLE = 2,
}
export enum NameserviceNameType { 
  ANYNAME = 0,
}
export enum DeviceNetworkType { 
  WIFI = 0,
  CELLULAR = 1,
  NOT_CONNECTED = 2,
}
