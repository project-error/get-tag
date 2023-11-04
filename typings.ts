import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { Endpoints } from "@octokit/types";
import { Commit } from "conventional-commits-parser";

export type ActionArgs = {
  repoToken: string;
  preRelease: boolean;
  automaticReleaseTag: string;
  environment: "dev" | "prod";
};

export type CreateReleaseParams =
  Endpoints["POST /repos/{owner}/{repo}/releases"]["parameters"];

export type GitGetRefParams =
  Endpoints["GET /repos/{owner}/{repo}/git/ref/{ref}"]["parameters"];

export type CreateRefParams =
  Endpoints["POST /repos/{owner}/{repo}/git/refs"]["parameters"];

export type ReposListTagsParams =
  Endpoints["GET /repos/{owner}/{repo}/tags"]["parameters"];

export type GetReleaseByTagParams =
  Endpoints["GET /repos/{owner}/{repo}/releases/tags/{tag}"]["parameters"];

export type BaseheadCommits =
  RestEndpointMethodTypes["repos"]["compareCommitsWithBasehead"]["response"];

export type BaseheadCommit = BaseheadCommits["data"]["commits"][0];

export type OctokitClient = InstanceType<typeof Octokit>;

export type ParsedCommit = {
  commitMsg: Commit;
  commit: BaseheadCommit;
};
