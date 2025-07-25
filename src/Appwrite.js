import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);

// movie = one video object from YouTube API (e.g., items[0])
export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const videoId = movie.id.videoId;
    const thumbnail = movie.snippet.thumbnails.high.url;

    const result = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("searchTerm", searchTerm)]
    );

    if (result.documents.length > 0) {
      const doc = result.documents[0];

      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          searchTerm,
          count: 1,
          video_id: videoId,
          video_url: thumbnail, // direct thumbnail link
        }
      );
    }
  } catch (error) {
    console.error("Appwrite error:", error);
  }
}
export const getTrendingMovies=async(searchTerm,movie)=>{
  try{
    const result =await database.listDocuments(DATABASE_ID,COLLECTION_ID,[
      Query.limit(5),
      Query.orderDesc("count")
  ])
    return  result.documents;
  }

  catch (error){
    console.log(error);
  }
}
