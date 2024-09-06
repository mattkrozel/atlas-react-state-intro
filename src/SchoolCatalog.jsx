import { useState, useEffect } from 'react';
export default function SchoolCatalog() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState({ key: '', direction: ''});
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch('/api/courses.json')
    .then(response => response.json())
    .then(data => setCourses(data));
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const sortCourse = [...courses].sort((a, b) => {
    if (sortOrder.key) {
      const firstSort = a[sortOrder.key].toString();
      const secondSort = b[sortOrder.key].toString();
      if (firstSort < secondSort) {
        return (sortOrder.direction === 'ascending' ? -1 : 1);
      } else {
        return (sortOrder.direction === 'ascending' ? 1 : -1);
      }
    }
    return (0);
  });

  const filteredCourses = sortCourse.filter((course) =>
    course.courseNumber.toLowerCase().includes(search.toLowerCase()) ||
    course.courseName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortOrder.key === key && sortOrder.direction === 'ascending') {
      direction = 'descending';
    }
    setSortOrder({ key, direction });
  };

  const currentPage = filteredCourses.slice((page - 1) * 5, page * 5);
  const hasMore = filteredCourses.length > page * 5;
  const hasLess = page > 1;

  return (
    <div className="school-catalog">
      <h1>School Catalog</h1>
      <input 
        type="text" 
        placeholder="Search"
        value={search}
        onChange={handleSearch}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('trimester')}>Trimester</th>
            <th onClick={() => handleSort('courseNumber')}>Course Number</th>
            <th onClick={() => handleSort('courseName')}>Course Name</th>
            <th onClick={() => handleSort('semesterCredits')}>Semester Credits</th>
            <th onClick={() => handleSort('totalClockHours')}>Total Clock Hours</th>
            <th>Enroll</th>
          </tr>
        </thead>
        <tbody>
          {currentPage.map((course) => (
            <tr key={course.courseNumber}>
              <td>{course.trimester}</td>
              <td>{course.courseNumber}</td>
              <td>{course.courseName}</td>
              <td>{course.semesterCredits}</td>
              <td>{course.totalClockHours}</td>
              <td>
                <button>Enroll</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button disabled={!hasLess} onClick={() => setPage(page - 1)}>Previous</button>
        <button disabled={!hasMore} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
