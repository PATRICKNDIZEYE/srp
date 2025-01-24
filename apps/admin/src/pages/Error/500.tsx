import { Link } from 'react-router-dom';

const Error500 = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-white p-5 dark:bg-boxdark">
      <div className="text-center">
        <h1 className="mb-4 text-7xl font-bold text-primary">500</h1>
        <h2 className="mb-5 text-2xl font-bold text-black dark:text-white">
          Server Error
        </h2>
        <p className="mb-6 text-lg text-black dark:text-white">
          Oops! Something went wrong on our end. Please try again later.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90"
        >
          <span>
            <svg
              className="fill-current"
              width="16"
              height="14"
              viewBox="0 0 16 14"
            >
              <path d="M14.7 6.3H5.5l3.1-3.1c.3-.3.3-.8 0-1.1s-.8-.3-1.1 0L2.2 7.4c-.3.3-.3.8 0 1.1l5.3 5.3c.3.3.8.3 1.1 0 .3-.3.3-.8 0-1.1L5.5 7.7h9.2c.4 0 .8-.3.8-.7s-.4-.7-.8-.7z" />
            </svg>
          </span>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Error500; 