const PageHeader = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <div>

        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}

      </div>

      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}

    </div>
  );
};

export default PageHeader;