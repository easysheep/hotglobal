// import React, { useEffect,useState } from "react";
// import Image from "next/image";
// import { FaArrowAltCircleUp } from "react-icons/fa";
// import { FaArrowAltCircleDown } from "react-icons/fa";
// import Link from "next/link";
// import moment from "moment/moment";
// const RecentPost = ({
//   title,
//   desc,
//   time,
//   postedOn,
//   upvotes,
//   downvotes,
//   postedBy,
//   imageUrl,
//   content,
//   uID,
// }) => {


//   const [timeAgo, setTimeAgo] = useState("");
//   const calculateTimeDifference = (postTime) => {
//     // Check if postTime is in timestring format (like "1h", "3d", "1w")
//     if (typeof postTime === "string" && postTime.match(/^\d+[smhdw]$/)) {
//       return postTime;
//     }

//     // If postTime is not in timestring format, calculate the time difference
//     const postMoment = moment(postTime);
//     const now = moment();
//     const duration = moment.duration(now.diff(postMoment));

//     if (duration.asHours() < 1) {
//       return `${Math.floor(duration.asMinutes())}m`;
//     } else if (duration.asDays() < 1) {
//       return `${Math.floor(duration.asHours())}h`;
//     } else if (duration.asWeeks() < 1) {
//       return `${Math.floor(duration.asDays())}d`;
//     } else {
//       return `${Math.floor(duration.asWeeks())}w`;
//     }
//   };

//   useEffect(() => {
//     setTimeAgo(calculateTimeDifference(time));
//   }, [time]);
//   return (
//     <Link
//       href={{
//         pathname: "/singleblog",
//         query: {
//           title: title,
//           upvotes: upvotes,
//           downvotes: downvotes,
//           desc: desc,
//           postedBy: postedBy,
//           postedOn: postedOn,
//           time: time,
//           imageUrl: imageUrl,
//           content: content,
//           uID: uID,
//         },
//       }}
//     >
//       <div className="cnt flex flex-col rounded-lg shadow-2xl  cursor-pointer bg-gray-200 transition-transform duration-300 transform hover:scale-105 border-2">
//         <div className="flex flex-row">
//           <div className="leftcnt w-2/6 h-48 relative">
//             <Image
//               src={imageUrl}
//               alt=""
//               layout="fill"
//               className="object-cover"
//               loading="lazy"
//             />
//           </div>
//           <div className="rightcnt w-4/6 py-1 px-2 relative">
//             <div className="pt-3 flex justify-between gap-2">
//               <div className="text-3xl font-semibold font-raleway">{title}</div>
//               <div className=" text-sm items-end font-bold">{timeAgo} ago</div>
//             </div>
//             <span className="font-roboto">{desc}</span>
//             <div className="flex justify-between absolute bottom-1 w-full">
//               <div className="text-lg flex gap-2 font-roboto">
//                 Posted On: <div className="text-purple-800"> {postedOn}</div>{" "}
//               </div>
//               <div className="flex gap-2 pr-5 pb-2">
//                 <button className="font-bold flex gap-1">
//                   {upvotes}
//                   <FaArrowAltCircleUp size={25} color={"rgb(40 228 138)"} />
//                 </button>
//                 <button className="font-bold flex gap-1">
//                   {downvotes}{" "}
//                   <FaArrowAltCircleDown size={25} color={"rgb(196 57 57)"} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default RecentPost;
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";
import Link from "next/link";
import moment from "moment/moment";

const RecentPost = ({
  title,
  desc,
  time,
  postedOn,
  upvotes,
  downvotes,
  postedBy,
  imageUrl,
  content,
  uID,
}) => {
  const [timeAgo, setTimeAgo] = useState("");

  const calculateTimeDifference = (postTime) => {
    // Check if postTime is in timestring format (like "1h", "3d", "1w")
    if (typeof postTime === "string" && postTime.match(/^\d+[smhdw]$/)) {
      return postTime;
    }

    // If postTime is not in timestring format, calculate the time difference
    const postMoment = moment(postTime);
    const now = moment();
    const duration = moment.duration(now.diff(postMoment));

    if (duration.asHours() < 1) {
      return `${Math.floor(duration.asMinutes())}m`;
    } else if (duration.asDays() < 1) {
      return `${Math.floor(duration.asHours())}h`;
    } else if (duration.asWeeks() < 1) {
      return `${Math.floor(duration.asDays())}d`;
    } else {
      return `${Math.floor(duration.asWeeks())}w`;
    }
  };

  useEffect(() => {
    setTimeAgo(calculateTimeDifference(time));
  }, [time]);

  return (
    <Link
      href={{
        pathname: "/singleblog",
        query: {
          title: title,
          upvotes: upvotes,
          downvotes: downvotes,
          desc: desc,
          postedBy: postedBy,
          postedOn: postedOn,
          time: time,
          imageUrl: imageUrl,
          content: content,
          uID: uID,
        },
      }}
    >
      <div className="cnt flex flex-col rounded-lg shadow-2xl cursor-pointer bg-gray-200 transition-transform duration-300 transform hover:scale-105 border-2">
        <div className="flex flex-row">
          <div className="leftcnt w-2/6 h-48 relative">
            <Image
              src={imageUrl}
              alt=""
              layout="fill"
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div className="rightcnt w-4/6 py-2 px-4 relative">
            <div className="pt-3 flex justify-between items-center">
              <div className="text-2xl font-semibold font-raleway leading-tight">{title}</div>
              <div className="text-sm text-gray-600">{timeAgo} ago</div>
            </div>
            
            {/* Conditional rendering of description based on screen size */}
            <div className="hidden md:block mt-2 text-sm text-gray-700">{desc}</div>
            
            <div className="flex justify-between items-center mt-3">
              <div className="text-sm text-gray-600">
                Posted On: <span className="text-purple-800">{postedOn}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 text-sm text-gray-700">
                  {upvotes}
                  <FaArrowAltCircleUp size={20} color={"rgb(40 228 138)"} />
                </button>
                <button className="flex items-center gap-1 text-sm text-gray-700">
                  {downvotes}{" "}
                  <FaArrowAltCircleDown size={20} color={"rgb(196 57 57)"} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecentPost;
