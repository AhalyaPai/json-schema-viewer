import { Box, Button, Flex, InvertTheme, subscribeTheme } from '@stoplight/mosaic';
import { action } from '@storybook/addon-actions';
import { boolean, number, object, select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { JSONSchema4 } from 'json-schema';
import * as React from 'react';

import { JsonSchemaViewer, RowAddonRenderer } from '../';

const allOfSchema = require('../__fixtures__/combiners/allOfs/base.json');
const allOfComplexSchema = require('../__fixtures__/combiners/allOfs/complex.json');
const schema = require('../__fixtures__/default-schema.json');
const stressSchema = require('../__fixtures__/stress-schema.json');
const boxFileSchema = require('../__fixtures__/real-world/box-file.json');
const githubIssueSchema = require('../__fixtures__/real-world/github-issue.json');
const refSchema = require('../__fixtures__/references/base.json');
const nullRefSchema = require('../__fixtures__/references/nullish.json');
const brokenRefArraySchema = require('../__fixtures__/arrays/of-refs.json');
const oneOfWithArraySchema = require('../__fixtures__/combiners/oneof-with-array-type.json');
const oneOfWithArraySchema2 = require('../__fixtures__/combiners/oneof-within-array-item.json');
const anyOfObject = require('../__fixtures__/combiners/anyOf.json');
const arrayOfComplexObjects = require('../__fixtures__/arrays/of-complex-objects.json');

subscribeTheme({ mode: 'light' });

storiesOf('JsonSchemaViewer', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <JsonSchemaViewer
      schema={schema as JSONSchema4}
      defaultExpandedDepth={number('defaultExpandedDepth', 0)}
      viewMode={select(
        'viewMode',
        {
          standalone: 'standalone',
          read: 'read',
          write: 'write',
        },
        'standalone',
      )}
      hideExamples={boolean('hideExamples', false)}
      onGoToRef={action('onGoToRef')}
    />
  ))
  .add('custom schema', () => (
    <JsonSchemaViewer
      schema={object('schema', {})}
      defaultExpandedDepth={number('defaultExpandedDepth', 0)}
      onGoToRef={action('onGoToRef')}
    />
  ))
  .add('custom row addon', () => {
    const customRowAddonRenderer: RowAddonRenderer = () => {
      return (
        <Flex h="full" alignItems="center">
          <Button pl={1} mr={1} size="sm" appearance="minimal" icon="bullseye" />
          <input type="checkbox" />
        </Flex>
      );
    };

    return (
      <JsonSchemaViewer
        schema={object('schema', schema as JSONSchema4)}
        onGoToRef={action('onGoToRef')}
        renderRowAddon={customRowAddonRenderer}
      />
    );
  })
  .add('array of objects', () => (
    <JsonSchemaViewer
      schema={arrayOfComplexObjects as JSONSchema4}
      defaultExpandedDepth={number('defaultExpandedDepth', 1)}
      onGoToRef={action('onGoToRef')}
      renderRootTreeLines={boolean('renderRootTreeLines', true)}
    />
  ))
  .add('stress-test schema', () => (
    <JsonSchemaViewer
      schema={stressSchema as JSONSchema4}
      defaultExpandedDepth={number('defaultExpandedDepth', 7)}
      onGoToRef={action('onGoToRef')}
    />
  ))

  .add('error boundary', () => (
    <JsonSchemaViewer
      // @ts-ignore
      schema={select(
        'schema',
        {
          'null (throws error)': null,
          'object (recovers from error)': schema,
        },
        null,
      )}
      defaultExpandedDepth={number('defaultExpandedDepth', 1)}
      onGoToRef={action('onGoToRef')}
    />
  ))
  .add('invalid types property pretty error message', () => (
    <JsonSchemaViewer
      schema={{
        type: 'object',
        // @ts-ignore
        properties: {
          id: {
            type: 'string',
          },
          address: {
            type: [
              // @ts-ignore
              'null',
              // @ts-ignore
              {
                type: 'object',
                properties: {
                  taskId: {
                    type: 'string',
                    format: 'uuid',
                  },
                },
              },
            ],
          },
        },
      }}
      defaultExpandedDepth={number('defaultExpandedDepth', 1)}
      onGoToRef={action('onGoToRef')}
    />
  ))
  .add('dark', () => {
    return (
      <InvertTheme>
        <Box bg="canvas">
          <JsonSchemaViewer
            schema={schema as JSONSchema4}
            defaultExpandedDepth={number('defaultExpandedDepth', 1)}
            onGoToRef={action('onGoToRef')}
          />
        </Box>
      </InvertTheme>
    );
  })
  .add('maxHeight', () => <JsonSchemaViewer schema={schema as JSONSchema4} maxHeight={number('maxHeight', 500)} />);

storiesOf('JsonSchemaViewer/combiners', module)
  .addDecorator(withKnobs)
  .add('simple allOf', () => (
    <JsonSchemaViewer
      schema={allOfSchema as JSONSchema4}
      defaultExpandedDepth={number('defaultExpandedDepth', 1)}
      onGoToRef={action('onGoToRef')}
    />
  ))
  .add('allOf-circular-schema', () => (
    <JsonSchemaViewer
      schema={allOfComplexSchema as JSONSchema4}
      defaultExpandedDepth={number('defaultExpandedDepth', 1)}
      onGoToRef={action('onGoToRef')}
    />
  ))
  .add('oneOf-array-schema', () => (
    <JsonSchemaViewer
      schema={oneOfWithArraySchema as JSONSchema4}
      defaultExpandedDepth={number('defaultExpandedDepth', 1)}
      onGoToRef={action('onGoToRef')}
    />
  ))
  .add('oneOf-array-schema2', () => (
    <JsonSchemaViewer
      schema={oneOfWithArraySchema2 as JSONSchema4}
      defaultExpandedDepth={number('defaultExpandedDepth', 1)}
      onGoToRef={action('onGoToRef')}
    />
  ))
  .add('anyOf-object-schema', () => (
    <JsonSchemaViewer
      schema={anyOfObject as JSONSchema4}
      defaultExpandedDepth={number('defaultExpandedDepth', 1)}
      onGoToRef={action('onGoToRef')}
    />
  ));

storiesOf('JsonSchemaViewer/$refs', module)
  .addDecorator(withKnobs)
  .add('normal', () => (
    <JsonSchemaViewer
      schema={refSchema as JSONSchema4}
      defaultExpandedDepth={number('defaultExpandedDepth', 1)}
      onGoToRef={action('onGoToRef')}
    />
  ))
  .add('nullish', () => (
    <JsonSchemaViewer
      schema={nullRefSchema as JSONSchema4}
      defaultExpandedDepth={number('defaultExpandedDepth', 1)}
      onGoToRef={action('onGoToRef')}
    />
  ))
  .add('broken', () => (
    <JsonSchemaViewer
      schema={brokenRefArraySchema as JSONSchema4}
      defaultExpandedDepth={number('defaultExpandedDepth', 1)}
      onGoToRef={action('onGoToRef')}
    />
  ));

storiesOf('JsonSchemaViewer/Real World Examples', module)
  .addDecorator(withKnobs)
  .add('Box "File" Schema', () => (
    <JsonSchemaViewer
      schema={boxFileSchema as JSONSchema4}
      defaultExpandedDepth={number('defaultExpandedDepth', 1)}
      onGoToRef={action('onGoToRef')}
      parentCrumbs={['Box', 'File']}
      renderRootTreeLines={boolean('renderRootTreeLines', true)}
    />
  ))
  .add('Github "Issue" Schema', () => (
    <JsonSchemaViewer
      schema={githubIssueSchema as JSONSchema4}
      defaultExpandedDepth={number('defaultExpandedDepth', 1)}
      onGoToRef={action('onGoToRef')}
      parentCrumbs={['Github', 'Issue']}
      renderRootTreeLines={boolean('renderRootTreeLines', true)}
    />
  ));
