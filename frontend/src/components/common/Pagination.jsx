import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex items-center justify-between mt-6">

      <p className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center gap-2">

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="
            w-10
            h-10
            rounded-lg
            border
            bg-white
            hover:bg-gray-100
            disabled:opacity-50
            disabled:cursor-not-allowed
            flex
            items-center
            justify-center
          "
        >
          <FaChevronLeft />
        </button>

        {Array.from({ length: totalPages }, (_, index) => (

          <button
            key={index}
            onClick={() => onPageChange(index + 1)}
            className={`
              w-10
              h-10
              rounded-lg
              transition
              ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white border hover:bg-gray-100"
              }
            `}
          >
            {index + 1}
          </button>

        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="
            w-10
            h-10
            rounded-lg
            border
            bg-white
            hover:bg-gray-100
            disabled:opacity-50
            disabled:cursor-not-allowed
            flex
            items-center
            justify-center
          "
        >
          <FaChevronRight />
        </button>

      </div>

    </div>
  );
};

export default Pagination;