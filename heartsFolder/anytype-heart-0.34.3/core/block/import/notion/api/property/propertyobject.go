package property

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/anyproto/anytype-heart/core/block/import/notion/api"
	"github.com/anyproto/anytype-heart/core/block/import/notion/api/client"
	"github.com/anyproto/anytype-heart/pkg/lib/logging"
)

var log = logging.Logger("notion-property-retriever")

const endpoint = "/pages/%s/properties/%s"

const endpointWithStartCursor = "/pages/%s/properties/%s?start_cursor=%s"

type TitleObject struct {
	Title api.RichText `json:"title"`
}

type RichTextObject struct {
	RichText api.RichText `json:"rich_text"`
}

type RelationObject struct {
	Relation Relation `json:"relation"`
}

type PeopleObject struct {
	People api.User `json:"people"`
}

type Properties map[string]Object

func (p *Properties) UnmarshalJSON(data []byte) error {
	var raw map[string]interface{}
	if err := json.Unmarshal(data, &raw); err != nil {
		return err
	}
	props := parsePropertyConfigs(raw)
	*p = props
	return nil
}

func parsePropertyConfigs(raw map[string]interface{}) Properties {
	result := make(Properties)
	for k, v := range raw {
		p := getPropertyObject(v)
		if p == nil {
			continue
		}
		result[k] = p
	}
	return result
}

func getPropertyObject(v interface{}) Object {
	var p Object
	switch rawProperty := v.(type) {
	case map[string]interface{}:
		switch ConfigType(rawProperty["type"].(string)) {
		case PropertyConfigTypeTitle:
			p = &TitleItem{}
		case PropertyConfigTypeRichText:
			p = &RichTextItem{}
		case PropertyConfigTypeNumber:
			p = &NumberItem{}
		case PropertyConfigTypeSelect:
			p = &SelectItem{}
		case PropertyConfigTypeMultiSelect:
			p = &MultiSelectItem{}
		case PropertyConfigTypeDate:
			p = &DateItem{}
		case PropertyConfigTypePeople:
			p = &PeopleItem{}
		case PropertyConfigTypeFiles:
			p = &FileItem{}
		case PropertyConfigTypeCheckbox:
			p = &CheckboxItem{}
		case PropertyConfigTypeURL:
			p = &URLItem{}
		case PropertyConfigTypeEmail:
			p = &EmailItem{}
		case PropertyConfigTypePhoneNumber:
			p = &PhoneItem{}
		case PropertyConfigTypeFormula:
			p = &FormulaItem{}
		case PropertyConfigTypeRelation:
			p = &RelationItem{}
		case PropertyConfigTypeRollup:
			p = &RollupItem{}
		case PropertyConfigCreatedTime:
			p = &CreatedTimeItem{}
		case PropertyConfigCreatedBy:
			p = &CreatedByItem{}
		case PropertyConfigLastEditedTime:
			p = &LastEditedTimeItem{}
		case PropertyConfigLastEditedBy:
			p = &LastEditedByItem{}
		case PropertyConfigStatus:
			p = &StatusItem{}
		case PropertyConfigVerification:
			p = &VerificationItem{}
		case PropertyConfigUniqueID:
			p = &UniqueIDItem{}
		default:
			log.Errorf("failed to get notion properties: unsupported property type: %s", rawProperty["type"].(string))
			return nil
		}
		b, err := json.Marshal(rawProperty)
		if err != nil {
			log.Errorf("failed to get notion properties, error: %s", err)
			return nil
		}

		if err = json.Unmarshal(b, &p); err != nil {
			log.Errorf("failed to get notion properties, error: %s", err)
			return nil
		}

	default:
		log.Errorf("failed to get notion properties: unsupported property format %T", v)
		return nil
	}
	return p
}

type Service struct {
	client *client.Client
}

func New(client *client.Client) *Service {
	return &Service{
		client: client,
	}
}

type propertyPaginatedRespone struct {
	Object     string        `json:"object"`
	ID         string        `json:"id"`
	Type       string        `json:"type"`
	Results    []interface{} `json:"results"`
	Item       interface{}   `json:"property_item"`
	HasMore    bool          `json:"has_more"`
	NextCursor string        `json:"next_cursor"`
}

// GetPropertyObject get from Notion properties values with tyoe People, Title, Relations and Rich text
// because they have pagination
func (s *Service) GetPropertyObject(ctx context.Context,
	pageID, propertyID, apiKey string,
	propertyType ConfigType) ([]interface{}, error) {
	var (
		hasMore     = true
		startCursor string
		response    propertyPaginatedRespone
		properties  = make([]interface{}, 0)
	)

	for hasMore {
		request := fmt.Sprintf(endpoint, pageID, propertyID)
		if startCursor != "" {
			request = fmt.Sprintf(endpointWithStartCursor, pageID, propertyID, startCursor)
		}

		req, err := s.client.PrepareRequest(ctx, apiKey, http.MethodGet, request, nil)
		if err != nil {
			return nil, fmt.Errorf("GetPropertyObject: %w", err)
		}
		res, err := s.client.DoWithRetry(endpoint, 0, req)

		if err != nil {
			return nil, fmt.Errorf("GetPropertyObject: %w", err)
		}
		defer res.Body.Close()

		b, err := ioutil.ReadAll(res.Body)
		if err != nil {
			return nil, err
		}

		if res.StatusCode != http.StatusOK {
			notionErr := client.TransformHTTPCodeToError(b)
			if notionErr == nil {
				return nil, fmt.Errorf("GetPropertyObject: failed http request, %d code", res.StatusCode)
			}
			return nil, notionErr
		}

		err = json.Unmarshal(b, &response)
		if err != nil {
			continue
		}
		result := response.Results
		for _, v := range result {
			buffer, err := json.Marshal(v)
			if err != nil {
				log.Errorf("GetPropertyObject: failed to marshal: %s", err)
				continue
			}
			if propertyType == PropertyConfigTypeTitle {
				p := TitleObject{}
				err = json.Unmarshal(buffer, &p)
				if err != nil {
					log.Errorf("GetPropertyObject: failed to marshal TitleItem: %s", err)
					continue
				}
				properties = append(properties, &p.Title)
			}
			if propertyType == PropertyConfigTypeRichText {
				p := RichTextObject{}
				err = json.Unmarshal(buffer, &p)
				if err != nil {
					log.Errorf("GetPropertyObject: failed to marshal RichTextItem: %s", err)
					continue
				}
				properties = append(properties, &p.RichText)
			}
			if propertyType == PropertyConfigTypeRelation {
				p := RelationObject{}
				err = json.Unmarshal(buffer, &p)
				if err != nil {
					log.Errorf("GetPropertyObject: failed to marshal RelationItem: %s", err)
					continue
				}
				properties = append(properties, &p.Relation)
			}
			if propertyType == PropertyConfigTypePeople {
				p := PeopleObject{}
				err = json.Unmarshal(buffer, &p)
				if err != nil {
					log.Errorf("GetPropertyObject: failed to marshal PeopleItem: %s", err)
					continue
				}

				properties = append(properties, &p.People)
			}
		}
		if response.HasMore {
			startCursor = response.NextCursor
			time.Sleep(time.Millisecond * 5) // to avoid rate limit
			continue
		}
		hasMore = false
	}
	return properties, nil
}
