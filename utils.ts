import { ParsedCommit } from "./typings";

export const getShortSHA = (sha: string): string => {
  const coreAbbrev = 7;
  return sha.substring(0, coreAbbrev);
};

export enum ConventionalCommitTypes {
  feat = "Features",
  fix = "Bug Fixes",
  docs = "Documentation",
  style = "Styles",
  refactor = "Code Refactoring",
  perf = "Performance Improvements",
  test = "Tests",
  build = "Builds",
  ci = "Continuous Integration",
  chore = "Chores",
  revert = "Reverts",
  breaking = "Breaking Changes",
}

const getFormattedChangelogEntry = (parsedCommit: ParsedCommit): string => {
  let entry = "";

  const url = parsedCommit.commit.html_url;
  const sha = getShortSHA(parsedCommit.commit.sha);
  const author = parsedCommit.commit.commit?.author?.name ?? "Unknown";

  entry = `- ${sha}: ${parsedCommit.commitMsg.header} (${author})`;
  if (parsedCommit.commitMsg.type) {
    const scopeStr = parsedCommit.commitMsg.scope
      ? `**${parsedCommit.commitMsg.scope}**: `
      : "";
    entry = `- ${scopeStr}${parsedCommit.commitMsg.subject} ([${author}](${url}))`;
  }

  return entry;
};

export const generateChangelogFromParsedCommits = (
  parsedCommits: ParsedCommit[],
): string => {
  let changelog = "";

  for (const key of Object.keys(ConventionalCommitTypes)) {
    const clBlock = parsedCommits
      .filter((val) => val.commitMsg.type === key)
      .map((val) => getFormattedChangelogEntry(val))
      .reduce((acc, line) => `${acc}\n${line}`, "");
    if (clBlock) {
      changelog += `\n\n## ${(ConventionalCommitTypes as any)[key]}\n`;
      changelog += clBlock.trim();
    }
  }

  // Commits
  const commits = parsedCommits
    .filter((val) => val.commitMsg.type === null)
    .map((val) => getFormattedChangelogEntry(val))
    .reduce((acc, line) => `${acc}\n${line}`, "");
  if (commits) {
    changelog += "\n\n## Commits\n";
    changelog += commits.trim();
  }

  return changelog;
};

export function getNextSemverBump(
  commits: ParsedCommit[],
  environment: string,
): string {
  let hasBreakingChange = false;
  let hasNewFeature = false;
  let hasNewFix = false;

  for (const commit of commits) {
    const commitType = commit.commitMsg.type;

    if (commitType === "fix") {
      hasNewFix = true;
    }

    // Check for breaking changes
    if (commitType === "breaking") {
      hasBreakingChange = true;
    }

    // Check for new features
    if (commitType === "feat") {
      hasNewFeature = true;
    }
  }

  // Determine semver bump based on commit types
  if (hasBreakingChange) {
    return "major";
  } else if (hasNewFeature) {
    return "minor";
  } else if (hasNewFix) {
    return "patch";
  } else if (environment === "prod") {
    return "patch";
  } else {
    return "";
  }
}
