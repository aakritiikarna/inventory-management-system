const DataTable = ({
  columns = [],
  children,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              {columns.map((column) => (

                <th
                  key={column}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                >
                  {column}
                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {children}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default DataTable;