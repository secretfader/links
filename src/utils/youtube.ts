import youtube from "@googleapis/youtube";

const auth = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const client = youtube.youtube("v3");

export const channelId =
  process.env.YOUTUBE_CHANNEL_ID || "UCRg-cd0XZe9FMVr_3DKGXEw";

export const podcastPlaylistId = "PLEkOaEkMOS01232QuKxydzBECkToCdOoR";

export async function getRecentVideos(
  channelId: string,
  count: number | undefined,
) {
  let results = [];
  let maxResults = count || 50;
  let pageToken: string | undefined = undefined;

  const {
    data: {
      pageInfo: { totalResults },
      items,
      nextPageToken,
    },
  } = await client.search.list({
    auth,
    channelId,
    maxResults,
    pageToken,
    part: "snippet",
    order: "date",
  });

  if (totalResults !== 0) {
    results = results.concat(filterVideos(items));
    pageToken = nextPageToken;
  }

  return results;
}

export async function getPlaylistVideos(playlistId: string) {
  let results = [];
  let pageToken: string | undefined = undefined;

  const {
    data: {
      pageInfo: { totalResults },
      items,
      nextPageToken,
    },
  } = await client.playlistItems.list({
    auth,
    playlistId,
    part: "id,snippet,status,contentDetails",
  });

  if (totalResults !== 0) {
    results = results.concat(items);
    pageToken = nextPageToken;
  }

  return results;
}

function filterVideos(videos) {
  return videos.filter(
    (video) =>
      video &&
      video.snippet &&
      video.snippet.description !== "" &&
      video.snippet.title.indexOf("#") === -1 &&
      video.id.kind === "youtube#video",
  );
}
