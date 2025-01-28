import { observer } from 'mobx-react';
import * as React from 'react';

import { SchemaModel } from '../../services/models';

import { PropertiesTable, PropertiesTableCaption } from '../../common-elements/fields-layout';
import { Field } from '../Fields/Field';
import { DiscriminatorDropdown } from './DiscriminatorDropdown';
import { SchemaProps } from './Schema';

import { mapWithLast } from '../../utils';
import { OptionsContext } from '../OptionsProvider';

export interface ObjectSchemaProps extends SchemaProps {
  discriminator?: {
    fieldName: string;
    parentSchema: SchemaModel;
  }[];
}

export const ObjectSchema = observer(
  ({
    schema: { fields = [], title, discriminatorProp },
    showTitle,
    discriminator,
    skipReadOnly,
    skipWriteOnly,
    level,
  }: ObjectSchemaProps) => {
    const { expandSingleSchemaField, showObjectSchemaExamples, schemaExpansionLevel } =
      React.useContext(OptionsContext);
    console.log('hello', discriminator);
    const filteredFields = React.useMemo(
      () =>
        skipReadOnly || skipWriteOnly
          ? fields.filter(
              item =>
                !(
                  (skipReadOnly && item.schema.readOnly) ||
                  (skipWriteOnly && item.schema.writeOnly)
                ),
            )
          : fields,
      [skipReadOnly, skipWriteOnly, fields],
    );

    const expandByDefault =
      (expandSingleSchemaField && filteredFields.length === 1) || schemaExpansionLevel >= level!;

    return (
      <PropertiesTable>
        {showTitle && <PropertiesTableCaption>{title}</PropertiesTableCaption>}
        <tbody>
          {mapWithLast(filteredFields, (field, isLast) => {
            console.log('here', discriminator, field.name, discriminatorProp);
            const discriminatorField = discriminator?.find(d => d.fieldName === field.name);
            return (
              <Field
                key={field.name}
                isLast={isLast}
                field={field}
                expandByDefault={expandByDefault}
                renderDiscriminatorSwitch={
                  discriminatorField
                    ? () => (
                        <DiscriminatorDropdown
                          parent={discriminatorField!.parentSchema}
                          enumValues={field.schema.enum}
                        />
                      )
                    : undefined
                }
                className={field.expanded ? 'expanded' : undefined}
                showExamples={showObjectSchemaExamples}
                skipReadOnly={skipReadOnly}
                skipWriteOnly={skipWriteOnly}
                showTitle={showTitle}
                level={level}
              />
            );
          })}
        </tbody>
      </PropertiesTable>
    );
  },
);
