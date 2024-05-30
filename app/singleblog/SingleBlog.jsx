"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { getDatabase, ref, get, update } from "firebase/database";
import { useAuth } from "../../AuthContext";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";

const SingleBlog = () => {
  const searchParams = useSearchParams();
  const postedOn = searchParams.get("postedOn");
  const title = searchParams.get("title");
  const content = searchParams.get("content");
  const time = searchParams.get("time");
  const postedBy = searchParams.get("postedBy");
  const upvotes = parseInt(searchParams.get("upvotes"), 10);
  const downvotes = parseInt(searchParams.get("downvotes"), 10);
  const imageUrl = searchParams.get("imageUrl");
  const uid = searchParams.get("uID");

  console.log("UID from searchParams:", uid);
  console.log("Title from searchParams:", title);

  // const updateUpvotes = async (uidToUpdate) => {
  //   const db = getDatabase();
  //   const postsRef = ref(db, "allposts");

  //   try {
  //     const snapshot = await get(postsRef);
  //     if (snapshot.exists()) {
  //       const posts = snapshot.val();
  //       console.log("Fetched posts:", posts);
  //       let postFound = false;

  //       for (const key in posts) {
  //         console.log(
  //           `Checking post with key: ${key} and UID: ${posts[key].uID}`
  //         );
  //         if (
  //           posts[key].uID == uidToUpdate ||
  //           (posts[key].uid && posts[key].uid.longUID == uidToUpdate)
  //         ) {
  //           // Increment the upvotes count
  //           const newUpvotes = (posts[key].upvotes || 0) + 1;
  //           console.log(
  //             `Post found. Updating upvotes from ${posts[key].upvotes} to ${newUpvotes}`
  //           );

  //           // Update the database with the modified post
  //           await update(ref(db, `allposts/${key}`), { upvotes: newUpvotes });
  //           console.log("Upvote recorded successfully!");
  //           postFound = true;
  //           break;
  //         }
  //       }

  //       if (!postFound) {
  //         console.log("Post not found.");
  //       }
  //     } else {
  //       console.log("No posts found in the database.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching or updating posts:", error);
  //   }
  // };

  // const updateDownvotes = async (uidToUpdate) => {
  //   const db = getDatabase();
  //   const postsRef = ref(db, "allposts");

  //   try {
  //     const snapshot = await get(postsRef);
  //     if (snapshot.exists()) {
  //       const posts = snapshot.val();
  //       console.log("Fetched posts:", posts);
  //       let postFound = false;

  //       for (const key in posts) {
  //         console.log(
  //           `Checking post with key: ${key} and UID: ${posts[key].uID}`
  //         );
  //         if (
  //           posts[key].uID == uidToUpdate ||
  //           (posts[key].uid && posts[key].uid.longUID == uidToUpdate)
  //         ) {
  //           // Increment the upvotes count
  //           const newDownvotes = (posts[key].downvotes || 0) + 1;
  //           console.log(
  //             `Post found. Updating upvotes from ${posts[key].downvotes} to ${newDownvotes}`
  //           );

  //           // Update the database with the modified post
  //           await update(ref(db, `allposts/${key}`), { downvotes: newDownvotes });
  //           console.log("Upvote recorded successfully!");
  //           postFound = true;
  //           break;
  //         }
  //       }

  //       if (!postFound) {
  //         console.log("Post not found.");
  //       }
  //     } else {
  //       console.log("No posts found in the database.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching or updating posts:", error);
  //   }
  // };

  const { logedin, username, currentUser } = useAuth();
  // const updateUpvotes = async (uidToUpdate) => {
  //   if (!logedin) {
  //     console.log("User not logged in. Cannot upvote.");
  //     return;
  //   }

  //   const db = getDatabase();
  //   const postsRef = ref(db, "allposts");

  //   try {
  //     const snapshot = await get(postsRef);
  //     if (snapshot.exists()) {
  //       const posts = snapshot.val();
  //       console.log("Fetched posts:", posts);
  //       let postFound = false;

  //       for (const key in posts) {
  //         if (
  //           posts[key].uID == uidToUpdate ||
  //           (posts[key].uid && posts[key].uid.longUID == uidToUpdate)
  //         ) {
  //           if (
  //             currentUser.uid === uidToUpdate &&
  //             posts[key].upvotedBy &&
  //             posts[key].upvotedBy[currentUser.uid]
  //           ) {
  //             console.log("User has already upvoted this post.");
  //             return;
  //           }

  //           // Increment the upvotes count
  //           const newUpvotes = (posts[key].upvotes || 0) + 1;
  //           console.log(
  //             `Post found. Updating upvotes from ${posts[key].upvotes} to ${newUpvotes}`
  //           );

  //           // Update the database with the modified post
  //           await update(ref(db, `allposts/${key}`), {
  //             upvotes: newUpvotes,
  //             [`upvotedBy/${currentUser.uid}`]: true, // Add user to upvotedBy list
  //           });
  //           console.log("Upvote recorded successfully!");
  //           postFound = true;
  //           break;
  //         }
  //       }

  //       if (!postFound) {
  //         console.log("Post not found.");
  //       }
  //     } else {
  //       console.log("No posts found in the database.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching or updating posts:", error);
  //   }
  // };

  //recent ones
  // const updateUserVoteStatus = async (userId, postId, voteType) => {
  //   const db = getDatabase();
  //   const userRef = ref(db, `users/${userId}/votes`);

  //   try {
  //     const userSnapshot = await get(userRef);
  //     let votes = userSnapshot.exists() ? userSnapshot.val() : {};

  //     if (voteType === "upvoted") {
  //       votes[postId] = "upvoted";
  //     } else if (voteType === "downvoted") {
  //       votes[postId] = "downvoted";
  //     }

  //     await update(userRef, votes);
  //   } catch (error) {
  //     console.error("Error updating user vote status:", error);
  //   }
  // };

  // const updateUpvotes = async (uidToUpdate) => {
  //   if (!logedin) {
  //     console.log("User not logged in. Cannot upvote.");
  //     toast.warn("Login To Upvote", {
  //       position: "top-center",
  //       autoClose: 1500,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "dark",
  //       transition: Bounce,
  //     });
  //     return;
  //   }

  //   const db = getDatabase();
  //   const postsRef = ref(db, "allposts");
  //   const userVotesRef = ref(db, `users/${currentUser.uid}/votes`);

  //   try {
  //     const [postsSnapshot, userVotesSnapshot] = await Promise.all([
  //       get(postsRef),
  //       get(userVotesRef),
  //     ]);

  //     if (postsSnapshot.exists()) {
  //       const posts = postsSnapshot.val();
  //       const userVotes = userVotesSnapshot.exists()
  //         ? userVotesSnapshot.val()
  //         : {};
  //       console.log("Fetched posts:", posts);

  //       for (const key in posts) {
  //         if (
  //           posts[key].uID == uidToUpdate ||
  //           (posts[key].uid && posts[key].uid.longUID == uidToUpdate)
  //         ) {
  //           if (userVotes[key] === "upvoted") {
  //             console.log("User has already upvoted this post.");
  //             toast.warn("Already Upvoted", {
  //               position: "top-center",
  //               autoClose: 1500,
  //               hideProgressBar: false,
  //               closeOnClick: true,
  //               pauseOnHover: true,
  //               draggable: true,
  //               progress: undefined,
  //               theme: "dark",
  //               transition: Bounce,
  //             });
  //             return;
  //           }

  //           // Increment the upvotes count
  //           const newUpvotes = (posts[key].upvotes || 0) + 1;
  //           console.log(
  //             `Post found. Updating upvotes from ${posts[key].upvotes} to ${newUpvotes}`
  //           );

  //           // Update the database with the modified post
  //           await update(ref(db, `allposts/${key}`), {
  //             upvotes: newUpvotes,
  //             [`upvotedBy/${currentUser.uid}`]: true, // Add user to upvotedBy list
  //           });

  //           // Update user's vote status in their profile or session data
  //           await updateUserVoteStatus(currentUser.uid, key, "upvoted");

  //           console.log("Upvote recorded successfully!");
  //           toast.success("Upvoted successfully!", {
  //             position: "top-center",
  //             autoClose: 1500,
  //             hideProgressBar: false,
  //             closeOnClick: true,
  //             pauseOnHover: true,
  //             draggable: true,
  //             progress: undefined,
  //             theme: "dark",
  //             transition: Bounce,
  //           });
  //           return;
  //         }
  //       }

  //       console.log("Post not found.");
  //     } else {
  //       console.log("No posts found in the database.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching or updating posts:", error);
  //   }
  // };

  const updateUserVoteStatus = async (userId, postId, voteType) => {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}/votes`);

    try {
      const votes = { [postId]: voteType }; // Create a new vote object

      await set(userRef, votes); // Overwrite existing data with new vote data
    } catch (error) {
      console.error("Error updating user vote status:", error);
    }
  };

  const updateVote = async (uidToUpdate, voteType) => {
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

        for (const key in posts) {
          if (
            posts[key].uID == uidToUpdate ||
            (posts[key].uid && posts[key].uid.longUID == uidToUpdate)
          ) {
            const currentVote = userVotes[key];
            let newUpvotes = posts[key].upvotes || 0;
            let newDownvotes = posts[key].downvotes || 0;

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
              newUpvotes -= 1;
              await update(ref(db, `allposts/${key}/upvotedBy`), {
                [currentUser.uid]: null,
              });
            } else if (currentVote === "downvoted") {
              newDownvotes -= 1;
              await update(ref(db, `allposts/${key}/downvotedBy`), {
                [currentUser.uid]: null,
              });
            }

            // Add new vote
            if (voteType === "upvoted") {
              newUpvotes += 1;
              await update(ref(db, `allposts/${key}/upvotedBy`), {
                [currentUser.uid]: true,
              });
            } else if (voteType === "downvoted") {
              newDownvotes += 1;
              await update(ref(db, `allposts/${key}/downvotedBy`), {
                [currentUser.uid]: true,
              });
            }

            // Prepare updates object for allposts
            const postUpdates = {
              upvotes: newUpvotes,
              downvotes: newDownvotes,
            };

            // Update post with new vote counts
            await update(ref(db, `allposts/${key}`), postUpdates);

            // Update user's vote status
            await updateUserVoteStatus(currentUser.uid, key, voteType); // Update voteType in users path

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
    await updateVote(uidToUpdate, "upvoted");
  };

  const updateDownvotes = async (uidToUpdate) => {
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
                    {time} ago
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
