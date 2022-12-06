import { ChangeEvent } from "react";

type Props = {
  onChange(e: ChangeEvent<HTMLInputElement>): void;
};

const Search = ({ onChange }: Props) => {
  return (
    <>
      <input type="search" id="keyword" name="keyword" placeholder="Search" onChange={onChange} />
    </>
  );
};

export default Search;
