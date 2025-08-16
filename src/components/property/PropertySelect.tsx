import {createRef, useEffect, useState} from 'react';
import {InputGroup} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import {FaHome} from 'react-icons/fa';
import {PropertyAttr, useGetAllProperties} from '../../Api';

export type PropertySelectItem = {
  id: number;
  label: string;
  name: string;
};

type Props = {
  onSelectProperty?: (item: PropertySelectItem | null) => void;
  placeholder?: string;
};

export function toPropertySelectItems(list: PropertyAttr[] | null) {
  if (!list) return [];
  return list
    .filter(item => typeof item.id === 'number')
    .map(item => ({
      id: item.id as number,
      label: `${item.code}`,
      name: item.code,
    }));
}

const PropertySelect = ({onSelectProperty, placeholder}: Props) => {
  const ref = createRef<Typeahead<PropertySelectItem>>();
  const [searchCriteria, setSearchCriteria] = useState('');
  const [selectedProperty, setSelectedProperty] =
    useState<PropertySelectItem | null>(null);
  const {data, loading, refetch} = useGetAllProperties({
    debounce: 300,
    lazy: true,
    queryParams: {
      search: searchCriteria,
    },
  });

  useEffect(() => {
    if (searchCriteria !== '') refetch();
  }, [searchCriteria]);

  return (
    <InputGroup className="mb-2">
      <InputGroup.Prepend>
        <InputGroup.Text>
          <FaHome />
        </InputGroup.Text>
      </InputGroup.Prepend>
      <Typeahead
        ref={ref}
        id="search-property-typeahead"
        isLoading={loading}
        multiple={false}
        placeholder={placeholder ?? 'search for a property'}
        onInputChange={input => setSearchCriteria(input)}
        onChange={selected => {
          setSelectedProperty(selected[0] ?? null);
          onSelectProperty && onSelectProperty(selected[0] ?? null);
        }}
        options={toPropertySelectItems(data)}
        selected={selectedProperty ? [selectedProperty] : []}
      />
    </InputGroup>
  );
};

export default PropertySelect;
