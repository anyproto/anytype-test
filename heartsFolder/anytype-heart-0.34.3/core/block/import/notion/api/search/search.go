package search

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/anyproto/anytype-heart/core/block/import/notion/api/client"
	"github.com/anyproto/anytype-heart/core/block/import/notion/api/database"
	"github.com/anyproto/anytype-heart/core/block/import/notion/api/page"
)

const (
	endpoint = "/search"
)

type Service struct {
	client *client.Client
}

type Response struct {
	Results    []interface{} `json:"results"`
	HasMore    bool          `json:"has_more"`
	NextCursor *string       `json:"next_cursor"`
}

// New is a constructor for Service
func New(client *client.Client) *Service {
	return &Service{
		client: client,
	}
}

type Effector func(ctx context.Context, apiKey string, pageSize int64) ([]database.Database, []page.Page, error)

// Search calls /search endoint from Notion, which return all databases and pages from user integration
func (s *Service) Search(ctx context.Context, apiKey string, pageSize int64) ([]database.Database, []page.Page, error) {
	var (
		hasMore         = true
		body            = &bytes.Buffer{}
		resultDatabases = make([]database.Database, 0)
		resultPages     = make([]page.Page, 0)
		startCursor     string
	)
	type Option struct {
		PageSize    int64  `json:"page_size,omitempty"`
		StartCursor string `json:"start_cursor,omitempty"`
	}

	for hasMore {
		body.Reset()
		err := json.NewEncoder(body).Encode(&Option{PageSize: pageSize, StartCursor: startCursor})

		if err != nil {
			return nil, nil, fmt.Errorf("ListDatabases: %w", err)
		}

		req, err := s.client.PrepareRequest(ctx, apiKey, http.MethodPost, endpoint, body)

		if err != nil {
			return nil, nil, fmt.Errorf("ListDatabases: %w", err)
		}
		res, err := s.client.DoWithRetry(endpoint, 3, req)

		if err != nil {
			return nil, nil, fmt.Errorf("ListDatabases: %w", err)
		}
		defer res.Body.Close()

		b, err := ioutil.ReadAll(res.Body)

		if err != nil {
			return nil, nil, err
		}
		var objects Response
		if res.StatusCode != http.StatusOK {
			notionErr := client.TransformHTTPCodeToError(b)
			if notionErr == nil {
				return nil, nil, fmt.Errorf("failed http request, %d code", res.StatusCode)
			}
			return nil, nil, notionErr
		}

		err = json.Unmarshal(b, &objects)

		if err != nil {
			return nil, nil, err
		}
		for _, o := range objects.Results {
			if o.(map[string]interface{})["object"] == database.ObjectType {
				db, err := json.Marshal(o)
				if err != nil {
					return nil, nil, fmt.Errorf("ListDatabases: %w", err)
				}
				d := database.Database{}
				err = json.Unmarshal(db, &d)
				if err != nil {
					return nil, nil, fmt.Errorf("ListDatabases: %w", err)
				}
				resultDatabases = append(resultDatabases, d)
			}
			if o.(map[string]interface{})["object"] == page.ObjectType {
				pg, err := json.Marshal(o)
				if err != nil {
					return nil, nil, fmt.Errorf("ListDatabases: %w", err)
				}
				p := page.Page{}
				err = json.Unmarshal(pg, &p)
				if err != nil {
					return nil, nil, fmt.Errorf("ListDatabases: %w", err)
				}
				resultPages = append(resultPages, p)
			}
		}

		if !objects.HasMore {
			hasMore = false
			continue
		}

		startCursor = *objects.NextCursor

	}
	return resultDatabases, resultPages, nil
}
