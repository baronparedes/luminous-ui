import {createRef, useEffect, useState} from 'react';
import {Button, InputGroup} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import {FaPlus, FaUserAlt} from 'react-icons/fa';

import {AuthProfile, useGetAllProfiles} from '../../Api';

export type ProfileSelectItem = {
  id: number;
  label: string;
  name: string;
  username: string;
  mobileNumber?: string;
  email: string;
};

type Props = {
  onSelectProfiles?: (items: ProfileSelectItem[]) => void;
};

export function toProfileSelectItems(list: AuthProfile[] | null) {
  if (!list) return [];
  return list.map(item => {
    const result: ProfileSelectItem = {
      id: item.id,
      label: `${item.name} (${item.username})`,
      username: item.username,
      name: item.name,
      mobileNumber: item.mobileNumber,
      email: item.email,
    };
    return result;
  });
}

const ProfileSelect = ({onSelectProfiles}: Props) => {
  const ref = createRef<Typeahead<ProfileSelectItem>>();
  const [searchCriteria, setSearchCriteria] = useState('');
  const [selectedProfiles, setSelectedProfiles] = useState<ProfileSelectItem[]>(
    []
  );
  const {data, loading, refetch} = useGetAllProfiles({
    debounce: 300,
    lazy: true,
    queryParams: {
      search: searchCriteria,
    },
  });

  const handleOnSelectProfiles = () => {
    onSelectProfiles && onSelectProfiles(selectedProfiles);
    setSelectedProfiles([]);
    ref.current?.clear();
  };

  useEffect(() => {
    if (searchCriteria !== '') refetch();
  }, [searchCriteria]);

  return (
    <>
      <InputGroup className="mb-2">
        <InputGroup.Text>
          <FaUserAlt />
        </InputGroup.Text>
        <Typeahead
          ref={ref}
          id="search-profile-typeahead"
          isLoading={loading}
          multiple
          placeholder="search for a profile"
          onInputChange={input => setSearchCriteria(input)}
          onChange={selected => {
            setSelectedProfiles(selected);
          }}
          options={toProfileSelectItems(data)}
        />
        <Button
          aria-label="select profile"
          variant="success"
          onClick={handleOnSelectProfiles}
        >
          <FaPlus />
        </Button>
      </InputGroup>
    </>
  );
};

export default ProfileSelect;
