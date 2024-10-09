import { Table } from "react-bootstrap";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap"; // Corrected import
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { useState, useMemo } from "react";

const ReusableTable = ({ headers, data, actions, excludeSortingHeaders }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ArrowUpward />
    ) : (
      <ArrowDownward />
    );
  };

  const handleSort = (key) => {
    if (excludeSortingHeaders.includes(key)) return; // Skip sorting for excluded headers
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  return (
    <Table responsive>
      <thead style={{ paddingLeft: "32px" }}>
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              onClick={() => handleSort(header)}
              style={{
                cursor: excludeSortingHeaders.includes(header)
                  ? "default"
                  : "pointer",
              }}
            >
              {header} {!excludeSortingHeaders.includes(header) && renderSortIcon(header)}
            </th>
          ))}
          {actions.length > 0 && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row) => (
          <tr key={row.id}>
            {Object.entries(row).map(
              ([key, cell], cellIndex) =>
                key !== "id" && <td key={cellIndex}>{cell}</td>
            )}
            {actions.length > 0 && (
              <td>
                {actions.map((action, actionIndex) => (
                  <Button
                    key={actionIndex}
                    onClick={() => action.handler(row)}
                    className="mr-2"
                  >
                    {action.label}
                  </Button>
                ))}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

ReusableTable.propTypes = {
  headers: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  actions: PropTypes.array,
  excludeSortingHeaders: PropTypes.array,
};

export default ReusableTable;