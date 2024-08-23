// Code generated by protoc-gen-go-drpc. DO NOT EDIT.
// protoc-gen-go-drpc version: v0.0.32
// source: commonspace/clientspaceproto/protos/clientspace.proto

package clientspaceproto

import (
	bytes "bytes"
	context "context"
	errors "errors"

	jsonpb "github.com/gogo/protobuf/jsonpb"
	proto "github.com/gogo/protobuf/proto"
	drpc "storj.io/drpc"
	drpcerr "storj.io/drpc/drpcerr"
)

type drpcEncoding_File_commonspace_clientspaceproto_protos_clientspace_proto struct{}

func (drpcEncoding_File_commonspace_clientspaceproto_protos_clientspace_proto) Marshal(msg drpc.Message) ([]byte, error) {
	return proto.Marshal(msg.(proto.Message))
}

func (drpcEncoding_File_commonspace_clientspaceproto_protos_clientspace_proto) Unmarshal(buf []byte, msg drpc.Message) error {
	return proto.Unmarshal(buf, msg.(proto.Message))
}

func (drpcEncoding_File_commonspace_clientspaceproto_protos_clientspace_proto) JSONMarshal(msg drpc.Message) ([]byte, error) {
	var buf bytes.Buffer
	err := new(jsonpb.Marshaler).Marshal(&buf, msg.(proto.Message))
	if err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func (drpcEncoding_File_commonspace_clientspaceproto_protos_clientspace_proto) JSONUnmarshal(buf []byte, msg drpc.Message) error {
	return jsonpb.Unmarshal(bytes.NewReader(buf), msg.(proto.Message))
}

type DRPCClientSpaceClient interface {
	DRPCConn() drpc.Conn

	SpaceExchange(ctx context.Context, in *SpaceExchangeRequest) (*SpaceExchangeResponse, error)
}

type drpcClientSpaceClient struct {
	cc drpc.Conn
}

func NewDRPCClientSpaceClient(cc drpc.Conn) DRPCClientSpaceClient {
	return &drpcClientSpaceClient{cc}
}

func (c *drpcClientSpaceClient) DRPCConn() drpc.Conn { return c.cc }

func (c *drpcClientSpaceClient) SpaceExchange(ctx context.Context, in *SpaceExchangeRequest) (*SpaceExchangeResponse, error) {
	out := new(SpaceExchangeResponse)
	err := c.cc.Invoke(ctx, "/clientspace.ClientSpace/SpaceExchange", drpcEncoding_File_commonspace_clientspaceproto_protos_clientspace_proto{}, in, out)
	if err != nil {
		return nil, err
	}
	return out, nil
}

type DRPCClientSpaceServer interface {
	SpaceExchange(context.Context, *SpaceExchangeRequest) (*SpaceExchangeResponse, error)
}

type DRPCClientSpaceUnimplementedServer struct{}

func (s *DRPCClientSpaceUnimplementedServer) SpaceExchange(context.Context, *SpaceExchangeRequest) (*SpaceExchangeResponse, error) {
	return nil, drpcerr.WithCode(errors.New("Unimplemented"), drpcerr.Unimplemented)
}

type DRPCClientSpaceDescription struct{}

func (DRPCClientSpaceDescription) NumMethods() int { return 1 }

func (DRPCClientSpaceDescription) Method(n int) (string, drpc.Encoding, drpc.Receiver, interface{}, bool) {
	switch n {
	case 0:
		return "/clientspace.ClientSpace/SpaceExchange", drpcEncoding_File_commonspace_clientspaceproto_protos_clientspace_proto{},
			func(srv interface{}, ctx context.Context, in1, in2 interface{}) (drpc.Message, error) {
				return srv.(DRPCClientSpaceServer).
					SpaceExchange(
						ctx,
						in1.(*SpaceExchangeRequest),
					)
			}, DRPCClientSpaceServer.SpaceExchange, true
	default:
		return "", nil, nil, nil, false
	}
}

func DRPCRegisterClientSpace(mux drpc.Mux, impl DRPCClientSpaceServer) error {
	return mux.Register(impl, DRPCClientSpaceDescription{})
}

type DRPCClientSpace_SpaceExchangeStream interface {
	drpc.Stream
	SendAndClose(*SpaceExchangeResponse) error
}

type drpcClientSpace_SpaceExchangeStream struct {
	drpc.Stream
}

func (x *drpcClientSpace_SpaceExchangeStream) SendAndClose(m *SpaceExchangeResponse) error {
	if err := x.MsgSend(m, drpcEncoding_File_commonspace_clientspaceproto_protos_clientspace_proto{}); err != nil {
		return err
	}
	return x.CloseSend()
}
