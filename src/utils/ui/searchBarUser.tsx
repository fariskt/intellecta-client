import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { fetchStudents } from "../../pages/admin/services/services";

interface Props {
  onSelect: (studentId: string, name?: string, email?: string) => void;
}



const SearchUser = ({ onSelect }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: students, isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: ()=> fetchStudents(),
  });

  const filtered = useMemo(() => {
    if (!students) return [];
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, students]);

  return (
    <StyledWrapper>
      <div className="group">
        <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
          <path d="M21.53 20.47l-3.66-3.66C19.195 15.24..." />
        </svg>
        <input
          className="input"
          type="search"
          placeholder="Search Students 🔍"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {searchTerm && (
        <ul className="results">
          {isLoading && <li>Loading...</li>}
          {filtered.map((s) => (
            <li key={s._id} onClick={() => onSelect(s._id, s.name, s.email)} className="rounded bg-[#029376] mt-4 py-2 flex justify-center text-white">
              {s.name}
            </li>
          ))}
          {filtered.length === 0 && <li>No match found</li>}
        </ul>
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .group {
    display: flex;
    line-height: 28px;
    align-items: center;
    position: relative;
    max-width: 190px;
  }

  .input {
    width: 100%;
    height: 40px;
    line-height: 28px;
    padding: 0 1rem;
    border: 2px solid;
    border-radius: 8px;
    outline: none;
    background-color: #f3f3f4;
    color: #0d0c22;
    transition: 0.3s ease;
  }

  .input::placeholder {
    color: #9e9ea7;
  }

  .input:focus,
  input:hover {
    outline: none;
    border-color: rgba(0, 48, 73, 0.4);
    background-color: #fff;
    box-shadow: 0 0 0 4px rgb(0 48 73 / 10%);
  }

  .icon {
    position: absolute;
    left: 1rem;
    fill: #9e9ea7;
    width: 1rem;
    height: 1rem;
  }
`;

export default SearchUser;
