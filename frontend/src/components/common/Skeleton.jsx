// Đảm bảo skeleton có kích thước cố định
const Skeleton = ({ className = "" }) => (
	<div
		className={`animate-pulse bg-gray-200 ${className}`}
		style={{ minHeight: "100px" }}
	/>
);

export default Skeleton;
