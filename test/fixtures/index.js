const list = [{
  id: 0,
  display: 'Coffee',
  value: 'coffee',
}, {
  id: 1,
  display: 'Tea',
  value: 'tea',
}, {
  id: 2,
  display: 'Pokemon',
  value: 'pokemon',
}];

const combination = {
  filter: list[2],
  search: 'Lugia',
  isEditing: false,
  isListVisible: false,
};

const options = [
  { display: 'Coffee', value: 'coffee' },
  { display: 'Tea', value: 'tea' },
  { display: 'Pokemon', value: 'pokemon' },
];

export {
  list,
  combination,
  options,
};
