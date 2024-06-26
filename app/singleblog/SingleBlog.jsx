"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { getDatabase, ref, get, update, onValue } from "firebase/database";
import { useAuth } from "../../AuthContext";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
import moment from "moment/moment";

const SingleBlog = () => {
  const searchParams = useSearchParams();
  const postedOn = searchParams.get("postedOn");
  const title = searchParams.get("title");
  const content = searchParams.get("content");
  const time = searchParams.get("time");
  const postedBy = searchParams.get("postedBy");
  const initialUpvotes = parseInt(searchParams.get("upvotes"), 10);
  const initialDownvotes = parseInt(searchParams.get("downvotes"), 10);
  const imageUrl = searchParams.get("imageUrl");
  const uid = searchParams.get("uID");
  const [timeAgo, setTimeAgo] = useState("");
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);

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

    // Set up listener for real-time updates
    const db = getDatabase();
    const postRef = ref(db, `allposts/${uid}`);
    const unsubscribe = onValue(postRef, (snapshot) => {
      const post = snapshot.val();
      if (post) {
        setUpvotes(initialUpvotes);
        setDownvotes(initialDownvotes);
      }
    });

    // Cleanup the listener on unmount
    return () => {
      unsubscribe();
    };
  }, [time, uid]);

  console.log("UID from searchParams:", uid);
  console.log("Title from searchParams:", title);
  const { logedin, currentUser } = useAuth();

  const updateUserVoteStatus = async (userId, postId, voteType) => {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}/votes`);

    try {
      const votes = { [postId]: voteType }; // Create a new vote object
      await update(userRef, votes); // Update existing data with new vote data
      console.log("User vote status updated:", votes);
    } catch (error) {
      console.error("Error updating user vote status:", error);
    }
  };

  const updateVote = async (uidToUpdate, voteType) => {
    console.log(
      "updateVote called with uidToUpdate:",
      uidToUpdate,
      "and voteType:",
      voteType
    );

    if (!logedin) {
      console.log("User not logged in. Cannot vote.");
      toast.warn("Login to vote", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    const db = getDatabase();
    const postsRef = ref(db, "allposts");
    const userVotesRef = ref(db, `users/${currentUser.uid}/votes`);

    try {
      console.log("Fetching posts and user votes...");
      const [postsSnapshot, userVotesSnapshot] = await Promise.all([
        get(postsRef),
        get(userVotesRef),
      ]);

      if (postsSnapshot.exists()) {
        const posts = postsSnapshot.val();
        const userVotes = userVotesSnapshot.exists()
          ? userVotesSnapshot.val()
          : {};
        console.log("Fetched posts:", posts);
        console.log("Fetched user votes:", userVotes);

        for (const key in posts) {
          if (
            posts[key].uID == uidToUpdate ||
            (posts[key].uid && posts[key].uid.longUID == uidToUpdate)
          ) {
            console.log("Matching post found with key:", key);

            const currentVote = userVotes[key];
            let newUpvotes = posts[key].upvotes || 0;
            let newDownvotes = posts[key].downvotes || 0;

            console.log("Current vote:", currentVote);
            console.log(
              "Current upvotes:",
              newUpvotes,
              "Current downvotes:",
              newDownvotes
            );

            // Check if the same vote type is passed
            if (currentVote === voteType) {
              console.log(`User has already ${voteType} this post.`);
              toast.warn(
                `Already ${
                  voteType.charAt(0).toUpperCase() + voteType.slice(1)
                }`,
                {
                  position: "top-center",
                  autoClose: 1500,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                  transition: Bounce,
                }
              );
              return;
            }

            // Remove previous vote if exists
            if (currentVote === "upvoted") {
              console.log("Removing previous upvote...");
              newUpvotes -= 1;
              setUpvotes(newUpvotes);
              await update(ref(db, `allposts/${key}/upvotedBy`), {
                [currentUser.uid]: null,
              });
            } else if (currentVote === "downvoted") {
              console.log("Removing previous downvote...");
              newDownvotes -= 1;
              setDownvotes(newDownvotes);
              await update(ref(db, `allposts/${key}/downvotedBy`), {
                [currentUser.uid]: null,
              });
            }

            // Add new vote
            if (voteType === "upvoted") {
              console.log("Adding new upvote...");
              newUpvotes += 1;
              await update(ref(db, `allposts/${key}/upvotedBy`), {
                [currentUser.uid]: true,
              });
              setUpvotes(newUpvotes);
            } else if (voteType === "downvoted") {
              console.log("Adding new downvote...");
              newDownvotes += 1;
              await update(ref(db, `allposts/${key}/downvotedBy`), {
                [currentUser.uid]: true,
              });
              setDownvotes(newDownvotes);
            }

            console.log(
              "Updated upvotes:",
              newUpvotes,
              "Updated downvotes:",
              newDownvotes
            );

            // Prepare updates object for allposts
            const postUpdates = {
              upvotes: newUpvotes,
              downvotes: newDownvotes,
            };

            // Update post with new vote counts
            console.log("Updating post with new vote counts...");
            await update(ref(db, `allposts/${key}`), postUpdates);

            // Update user's vote status
            console.log("Updating user's vote status...");
            await updateUserVoteStatus(currentUser.uid, key, voteType);

            console.log(
              `${
                voteType.charAt(0).toUpperCase() + voteType.slice(1)
              } recorded successfully!`
            );
            toast.success(
              `${
                voteType.charAt(0).toUpperCase() + voteType.slice(1)
              } recorded successfully!`,
              {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
              }
            );
            return;
          }
        }

        console.log("Post not found.");
      } else {
        console.log("No posts found in the database.");
      }
    } catch (error) {
      console.error("Error fetching or updating posts:", error);
    }
  };

  const updateUpvotes = async (uidToUpdate) => {
    console.log("updateUpvotes called with uidToUpdate:", uidToUpdate);
    await updateVote(uidToUpdate, "upvoted");
  };

  const updateDownvotes = async (uidToUpdate) => {
    console.log("updateDownvotes called with uidToUpdate:", uidToUpdate);
    await updateVote(uidToUpdate, "downvoted");
  };

  return (
    <div className="">
      <div className="h-1 bg-slate-800  mb-3"></div>
      <div className="pb-4 rounded-xl">
        <div className="cnt  flex flex-col pt-1">
          <div className="flex flex-col">
            <div className="upcnt  h-60 relative pt-1">
              <Image
                src={imageUrl}
                alt="/pizza.png"
                layout="fill"
                className="object-cover"
                priority
              />
            </div>
            <div className="downcnt   px-2 relative">
              <div className=" flex justify-center mt-2">
                <div className="text-4xl font-bold text-purple1 font-roboto ">
                  {title}
                </div>
              </div>

              <div className="flex justify-between mt-2">
                <div className="">
                  <div className="text-xl pt-2 flex gap-1">
                    Posted On:{" "}
                    <div className="font-bold font-monte cursor-pointer text-purple1">
                      {postedOn}
                    </div>
                  </div>
                </div>
                <div className="flex itmes-center">
                  <div className="flex text-lg items-end font-bold">
                    {timeAgo} ago
                  </div>
                </div>
              </div>
              <div className="py-4">
                <div className="font-roboto">{content}</div>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-2 ">
                  By{" "}
                  <div className="font-bold cursor-pointer text-purple1 font-monte">
                    {postedBy}
                  </div>
                </div>
                <div className="flex gap-2  justify-end">
                  <button
                    className="font-bold flex gap-1 mx-1"
                    onClick={() => updateUpvotes(uid)}
                  >
                    {upvotes}{" "}
                    <FaArrowAltCircleUp size={25} color={"rgb(40 228 138)"} />
                  </button>
                  <button
                    className="font-bold flex gap-1 ml-1"
                    onClick={() => updateDownvotes(uid)}
                  >
                    {downvotes}{" "}
                    <FaArrowAltCircleDown size={25} color={"rgb(196 57 57)"} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
