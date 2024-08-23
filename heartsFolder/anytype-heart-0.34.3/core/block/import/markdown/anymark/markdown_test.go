package anymark

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"reflect"
	"testing"

	"github.com/stretchr/testify/require"
)

type MdCase struct {
	MD     string                   `json:"md"`
	Blocks []map[string]interface{} `json:"blocks"`
	Desc   string                   `json:"desc"`
}

func TestConvertMdToBlocks(t *testing.T) {
	bs, err := ioutil.ReadFile("testdata/md_cases.json")
	if err != nil {
		panic(err)
	}
	var testCases []MdCase
	if err := json.Unmarshal(bs, &testCases); err != nil {
		panic(err)
	}

	for testNum, testCase := range testCases {
		t.Run(testCase.Desc, func(t *testing.T) {
			blocks, _, err := MarkdownToBlocks([]byte(testCases[testNum].MD), "", []string{})
			require.NoError(t, err)
			replaceFakeIds(blocks)

			actualJson, err := json.Marshal(blocks)
			require.NoError(t, err)

			var actual []map[string]interface{}
			err = json.Unmarshal(actualJson, &actual)
			require.NoError(t, err)

			if !reflect.DeepEqual(testCase.Blocks, actual) {
				fmt.Println("expected:\n", string(actualJson))
				require.Equal(t, testCase.Blocks, actual)
			}
		})
	}
}
