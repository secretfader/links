import youtube from "@googleapis/youtube";

const auth = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const client = youtube.youtube("v3");

export const channelId =
  process.env.YOUTUBE_CHANNEL_ID || "UCRg-cd0XZe9FMVr_3DKGXEw";

export async function getRecentVideos(count, channelId) {
  let results = [];
  let pageToken: string | undefined = undefined;

  while (results.length < count) {
    const {
      data: { pageInfo, nextPageToken, items },
    } = await client.search.list({
      auth,
      channelId,
      pageToken,
      part: "snippet",
      order: "date",
    });

    if (pageInfo.totalResults > 0) {
      results.concat(filterVideos(items));
      pageToken = nextPageToken;
    }
  }

  return results;
}

export async function getPlaylistVideos(playlistId) {
  let results = [];

  const {
    data: { pageInfo, items },
  } = await client.playlistItems.list({
    auth,
    playlistId,
    part: "id,snippet,status",
  });

  if (pageInfo.totalResults > 0) {
    results.concat(filterVideos(items));
  }

  return results;
}

function filterVideos(videos) {
  videos.filter(
    (video) =>
      video &&
      video.snippet &&
      video.snippet.description !== "" &&
      video.snippet.title.indexOf("#") === -1 &&
      video.id.kind === "youtube#video",
  );
}
