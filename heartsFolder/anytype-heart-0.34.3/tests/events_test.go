//go:build integration

package tests

import (
	"context"
	"errors"
	"fmt"
	"io"
	"sync"
	"testing"
	"time"

	"github.com/anyproto/anytype-heart/pb"
	"github.com/anyproto/anytype-heart/pb/service"
)

type eventReceiver struct {
	lock   *sync.Mutex
	events []*pb.EventMessage
	token  string
}

func startEventReceiver(ctx context.Context, c service.ClientCommandsClient, tok string) (*eventReceiver, error) {
	stream, err := c.ListenSessionEvents(ctx, &pb.StreamRequest{Token: tok})
	if err != nil {
		return nil, err
	}

	er := &eventReceiver{
		lock:  &sync.Mutex{},
		token: tok,
	}
	go func() {
		for {
			select {
			case <-ctx.Done():
				return
			default:
				ev, err := stream.Recv()
				if errors.Is(err, io.EOF) {
					return
				}
				if err != nil {
					fmt.Println("receive error:", err)
					continue
				}
				er.lock.Lock()
				for _, m := range ev.Messages {
					er.events = append(er.events, m)
				}
				er.lock.Unlock()
			}
		}
	}()
	return er, nil
}

type eventReceiverProvider interface {
	EventReceiver() *eventReceiver
}

func waitEvent[msgType pb.IsEventMessageValue](t *testing.T, provider eventReceiverProvider, fn func(x msgType)) {
	er := provider.EventReceiver()

	ticker := time.NewTicker(10 * time.Millisecond)
	timeout := time.NewTimer(2 * time.Second)
	for {
		er.lock.Lock()
		for i := len(er.events) - 1; i >= 0; i-- {
			m := er.events[i]
			if m == nil {
				continue
			}
			if v, ok := m.Value.(msgType); ok {
				fn(v)
				er.events[i] = nil
				er.lock.Unlock()
				return
			}
		}
		er.lock.Unlock()

		select {
		case <-ticker.C:
		case <-timeout.C:
			t.Fatal("wait event timeout")
		}
	}
}
