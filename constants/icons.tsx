type IconProps = {
  isActive?: boolean;
  className?: string;
  width?: number;
  height?: number;
};

export const HomeIcon = ({
  isActive = false,
  className = '',
  width = 24,
  height = 24,
}: IconProps) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        className={`${className} transition-opacity duration-300`}
      >
        <path
          opacity={isActive ? '1' : '0.4'}
          d="M20.83 8.01L14.28 2.77C13 1.75 11 1.74 9.72996 2.76L3.17996 8.01C2.23996 8.76 1.66996 10.26 1.86996 11.44L3.12996 18.98C3.41996 20.67 4.98996 22 6.69996 22H17.3C18.99 22 20.59 20.64 20.88 18.97L22.14 11.43C22.32 10.26 21.75 8.76 20.83 8.01ZM12.75 18C12.75 18.41 12.41 18.75 12 18.75C11.59 18.75 11.25 18.41 11.25 18V15C11.25 14.59 11.59 14.25 12 14.25C12.41 14.25 12.75 14.59 12.75 15V18Z"
          fill="white"
        />
      </svg>
    </>
  );
};

export const DiscoverIcon = ({
  isActive = false,
  className = '',
  width = 24,
  height = 24,
}: IconProps) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        className={`${className} transition-opacity duration-300`}
      >
        <path
          opacity={isActive ? '1' : '0.4'}
          d="M19.9999 9.9999C19.9999 15.5229 15.5229 19.9999 9.9999 19.9999C4.4769 19.9999 -9.91821e-05 15.5229 -9.91821e-05 9.9999C-9.91821e-05 4.4779 4.4769 -9.91821e-05 9.9999 -9.91821e-05C15.5229 -9.91821e-05 19.9999 4.4779 19.9999 9.9999Z"
          fill="white"
        />
        <path
          d="M13.8598 6.7049L12.2398 11.8249C12.1798 12.0349 12.0098 12.2049 11.7998 12.2659L6.6998 13.8649C6.3598 13.9759 6.0298 13.6449 6.1398 13.3049L7.7398 8.1749C7.7998 7.9649 7.9698 7.8049 8.1798 7.7349L13.2998 6.1349C13.6498 6.0249 13.9698 6.3549 13.8598 6.7049Z"
          fill={isActive ? 'gray' : 'white'}
        />
      </svg>
    </>
  );
};

export const MicrophoneIcon = ({
  isActive = false,
  className = '',
  width = 24,
  height = 24,
}: IconProps) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        className={`${className} transition-opacity duration-300`}
      >
        <path
          opacity={isActive ? '1' : '0.4'}
          d="M19.12 9.12C18.73 9.12 18.42 9.43 18.42 9.82V11.4C18.42 14.94 15.54 17.82 12 17.82C8.46 17.82 5.58 14.94 5.58 11.4V9.81C5.58 9.42 5.27 9.11 4.88 9.11C4.49 9.11 4.18 9.42 4.18 9.81V11.39C4.18 15.46 7.31 18.81 11.3 19.17V21.3C11.3 21.69 11.61 22 12 22C12.39 22 12.7 21.69 12.7 21.3V19.17C16.68 18.82 19.82 15.46 19.82 11.39V9.81C19.81 9.43 19.5 9.12 19.12 9.12Z"
          fill="white"
        />
        <path
          d="M12 2C9.56 2 7.58 3.98 7.58 6.42V11.54C7.58 13.98 9.56 15.96 12 15.96C14.44 15.96 16.42 13.98 16.42 11.54V6.42C16.42 3.98 14.44 2 12 2ZM13.31 8.95C13.24 9.21 13.01 9.38 12.75 9.38C12.7 9.38 12.65 9.37 12.6 9.36C12.21 9.25 11.8 9.25 11.41 9.36C11.09 9.45 10.78 9.26 10.7 8.95C10.61 8.64 10.8 8.32 11.11 8.24C11.7 8.08 12.32 8.08 12.91 8.24C13.21 8.32 13.39 8.64 13.31 8.95ZM13.84 7.01C13.75 7.25 13.53 7.39 13.29 7.39C13.22 7.39 13.16 7.38 13.09 7.36C12.39 7.1 11.61 7.1 10.91 7.36C10.61 7.47 10.27 7.31 10.16 7.01C10.05 6.71 10.21 6.37 10.51 6.27C11.47 5.92 12.53 5.92 13.49 6.27C13.79 6.38 13.95 6.71 13.84 7.01Z"
          fill="white"
        />
      </svg>
    </>
  );
};
