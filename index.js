const fetchGithubActivity = async (username) => {
  try {
    const url = `https://api.github.com/users/${username}/events`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "node.js",
      },
    });
    return res.json();
  } catch (error) {
    if (error.status === 404) {
      console.error("user not found. please check the username.");
    } else {
      console.error("Error fetching data: ", error.message);
    }
  }
};

const displayGithubActivity = (events) => {
  if (events.length === 0) {
    console.log("No recent activity found.");
  }
  events.forEach((event) => {
    let action;
    switch (event.type) {
      case "PushEvent":
        let commitCount = event.payload.commits.length;
        let repo = event.repo.name;
        action = `Pushed ${commitCount} commit(s) to ${repo}`;
        break;
      case "IssuesEvent":
        action = `${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} an issue in ${event.repo.name}`;
        break;
      case "WatchEvent":
        action = `Starred ${event.repo.name}`;
        break;
      case "ForkEvent":
        action = `Starred ${event.repo.name}`;
        break;
      case "CreateEvent":
        action = `Created ${event.payload.ref_type} in ${event.repo.name}`;
        break;
      default:
        action = `${event.type.replace("Event", "")} in ${event.repo.name}`;
    }
    console.log(`-${action}`);
  });
};

const username = process.argv[2];
if (!username) {
  console.error("Please provide a GitHub username.");
  process.exit(1);
}
const main = async (username) => {
  try {
    const events = await fetchGithubActivity(username);
    displayGithubActivity(events);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
main(username);
