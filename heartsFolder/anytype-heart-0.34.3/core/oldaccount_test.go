package core

// TODO: Update the test
// func TestAccount(t *testing.T) {
//	_, mw, close := start(t, nil)
//	defer close()
//
//	t.Run("account_should_open", func(t *testing.T) {
//		accId := mw.GetAnytype().AccountObjects().Account
//		mw.ObjectCreate(&pb.RpcObjectCreateRequest{})
//		resp := mw.ObjectOpen(&pb.RpcObjectOpenRequest{ObjectId: accId})
//		require.Equal(t, 0, int(resp.Error.Code), resp.Error.Description)
//		show := getEventObjectShow(resp.Event.Messages)
//	})
//
// }
