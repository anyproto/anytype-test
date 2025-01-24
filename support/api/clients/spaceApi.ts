import {
  Rpc_Space_InviteGenerate_Request,
  Rpc_Space_InviteGenerate_Response,
  Rpc_Space_InviteView_Request,
  Rpc_Space_InviteView_Response,
  Rpc_Space_InviteView_Response_Error_Code,
  Rpc_Space_MakeShareable_Request,
  Rpc_Space_MakeShareable_Response,
  Rpc_Space_InviteGenerate_Response_Error_Code,
  Rpc_Space_MakeShareable_Response_Error_Code,
  Rpc_Space_RequestApprove_Request,
  Rpc_Space_RequestApprove_Response,
  Rpc_Space_RequestApprove_Response_Error_Code,
  Rpc_Space_Join_Request,
  Rpc_Space_Join_Response,
  Rpc_Space_Join_Response_Error_Code,
  Rpc_Space_JoinCancel_Request,
  Rpc_Space_JoinCancel_Response,
  Rpc_Space_JoinCancel_Response_Error_Code,
  Rpc_Space_RequestDecline_Response,
  Rpc_Space_RequestDecline_Request,
  Rpc_Space_RequestDecline_Response_Error_Code,
  Rpc_Space_ParticipantRemove_Request,
  Rpc_Space_ParticipantRemove_Response,
  Rpc_Space_ParticipantRemove_Response_Error_Code,
  Rpc_Space_ParticipantPermissionsChange_Request,
  Rpc_Space_ParticipantPermissionsChange_Response,
  Rpc_Space_ParticipantPermissionsChange_Response_Error_Code,
  Rpc_Space_StopSharing_Request,
  Rpc_Space_StopSharing_Response,
  Rpc_Space_StopSharing_Response_Error_Code,
  Rpc_Space_InviteGetCurrent_Request,
  Rpc_Space_InviteGetCurrent_Response,
  Rpc_Space_InviteGetCurrent_Response_Error_Code,
  Rpc_Space_InviteRevoke_Request,
  Rpc_Space_InviteRevoke_Response,
  Rpc_Space_InviteRevoke_Response_Error_Code,
  Rpc_Space_LeaveApprove_Request,
  Rpc_Space_LeaveApprove_Response,
  Rpc_Space_LeaveApprove_Response_Error_Code,
  Rpc_Space_Delete_Request,
  Rpc_Space_Delete_Response,
} from "../../../pb/pb/protos/commands";
import { ParticipantPermissions } from "../../../pb/pkg/lib/pb/model/protos/models";
import { getCurrentClient } from "../helpers/proxy";
import { makeGrpcCall } from "../services/utils";

//OWNER ONLY
export async function callSpaceMakeShareable(spaceId: string): Promise<void> {
  const request: Rpc_Space_MakeShareable_Request = {
    spaceId: spaceId,
  };

  try {
    const response = await makeGrpcCall<Rpc_Space_MakeShareable_Response>(
      getCurrentClient().spaceMakeShareable,
      request
    );
    if (!response.error || response.error.code === 0) {
      console.log("Space made shareable successfully:", response);
    } else {
      throw new Error(
        `Failed to make space shareable: ${
          response.error.description
        } (Error code: ${response.error.code}- ${
          Rpc_Space_MakeShareable_Response_Error_Code[response.error.code]
        })`
      );
    }
  } catch (error) {
    console.error("Failed to make space shareable:", error);
    throw error;
  }
}

export async function callSpaceInviteGenerate(
  spaceId: string
): Promise<{ inviteContentId: string; inviteFileKey: string }> {
  const request: Rpc_Space_InviteGenerate_Request = {
    spaceId: spaceId,
  };

  try {
    const response = await makeGrpcCall<Rpc_Space_InviteGenerate_Response>(
      getCurrentClient().spaceInviteGenerate,
      request
    );

    if (!response.error || response.error.code === 0) {
      console.log("Space invite generated successfully:", response);
      return {
        inviteContentId: response.inviteCid,
        inviteFileKey: response.inviteFileKey,
      };
    } else {
      throw new Error(
        `Failed to generate space invite: ${
          response.error.description
        } (Error code: ${response.error.code} - ${
          Rpc_Space_InviteGenerate_Response_Error_Code[response.error.code]
        })`
      );
    }
  } catch (error) {
    console.error("Failed to generate space invite:", error);
    throw error;
  }
}

export async function callSpaceRequestApprove(
  spaceId: string,
  identity: string,
  permissions: "reader" | "editor"
): Promise<void> {
  const permissionMap = {
    reader: ParticipantPermissions.Reader,
    editor: ParticipantPermissions.Writer,
    // none: ParticipantPermissions.NoPermissions,
    // owner: ParticipantPermissions.Owner,
  };

  const request: Rpc_Space_RequestApprove_Request = {
    spaceId: spaceId,
    identity: identity,
    permissions: permissionMap[permissions],
  };
  console.log("Space request approve request:", JSON.stringify(request));
  try {
    const response = await makeGrpcCall<Rpc_Space_RequestApprove_Response>(
      getCurrentClient().spaceRequestApprove,
      request
    );

    if (!response.error || response.error.code === 0) {
      console.log(
        "Space request approved successfully:",
        JSON.stringify(response)
      );
    } else {
      throw new Error(
        `Failed to approve space request: ${
          response.error.description
        } (Error code: ${response.error.code} - ${
          Rpc_Space_RequestApprove_Response_Error_Code[response.error.code]
        })`
      );
    }
  } catch (error) {
    console.error("Failed to approve space request:", error);
    throw error;
  }
}

export async function callSpaceRequestDecline(
  spaceId: string,
  identity: string
): Promise<void> {
  const request: Rpc_Space_RequestDecline_Request = {
    spaceId: spaceId,
    identity: identity,
  };

  try {
    const response = await makeGrpcCall<Rpc_Space_RequestDecline_Response>(
      getCurrentClient().spaceRequestDecline,
      request
    );

    if (!response.error || response.error.code === 0) {
      console.log("Space request declined successfully:", response);
    } else {
      throw new Error(
        `Failed to decline space request: ${
          response.error.description
        } (Error code: ${response.error.code} - ${
          Rpc_Space_RequestDecline_Response_Error_Code[response.error.code]
        })`
      );
    }
  } catch (error) {
    console.error("Failed to decline space request:", error);
    throw error;
  }
}

export async function callSpaceParticipantRemove(
  spaceId: string,
  identity: string
): Promise<void> {
  const request: Rpc_Space_ParticipantRemove_Request = {
    spaceId: spaceId,
    identities: [identity],
  };

  try {
    const response = await makeGrpcCall<Rpc_Space_ParticipantRemove_Response>(
      getCurrentClient().spaceParticipantRemove,
      request
    );
    if (!response.error || response.error.code === 0) {
      console.log("Space participant removed successfully:", response);
    } else {
      throw new Error(
        `Failed to remove space participant: ${
          response.error.description
        } (Error code: ${response.error.code} - ${
          Rpc_Space_ParticipantRemove_Response_Error_Code[response.error.code]
        })`
      );
    }
  } catch (error) {
    console.error("Failed to remove space participant:", error);
    throw error;
  }
}

export async function callSpaceParticipantPermissionsChange(
  spaceId: string,
  identity: string,
  permissions: "reader" | "editor"
): Promise<void> {
  const permissionMap = {
    reader: ParticipantPermissions.Reader,
    editor: ParticipantPermissions.Writer,
    // none: ParticipantPermissions.NoPermissions,
    // owner: ParticipantPermissions.Owner,
  };

  const request: Rpc_Space_ParticipantPermissionsChange_Request = {
    spaceId: spaceId,
    changes: [
      {
        identity: identity,
        perms: permissionMap[permissions],
      },
    ],
  };

  try {
    const response =
      await makeGrpcCall<Rpc_Space_ParticipantPermissionsChange_Response>(
        getCurrentClient().spaceParticipantPermissionsChange,
        request
      );

    if (!response.error || response.error.code === 0) {
      console.log("Space participant removed successfully:", response);
    } else {
      throw new Error(
        `Failed to change space participant permissions: ${
          response.error.description
        } (Error code: ${response.error.code} - ${
          Rpc_Space_ParticipantPermissionsChange_Response_Error_Code[
            response.error.code
          ]
        })`
      );
    }
  } catch (error) {
    console.error("Failed to change space participant permissions:", error);
    throw error;
  }
}

export async function callSpaceStopSharing(spaceId: string): Promise<void> {
  const request: Rpc_Space_StopSharing_Request = {
    spaceId: spaceId,
  };

  try {
    const response = await makeGrpcCall<Rpc_Space_StopSharing_Response>(
      getCurrentClient().spaceStopSharing,
      request
    );

    if (!response.error || response.error.code === 0) {
      console.log("Space sharing stopped successfully:", response);
    } else {
      throw new Error(
        `Failed to stop sharing space: ${
          response.error.description
        } (Error code: ${response.error.code} - ${
          Rpc_Space_StopSharing_Response_Error_Code[response.error.code]
        })`
      );
    }
  } catch (error) {
    console.error("Failed to stop sharing space:", error);
    throw error;
  }
}

export async function callSpaceInviteRevoke(spaceId: string): Promise<void> {
  const request: Rpc_Space_InviteRevoke_Request = {
    spaceId: spaceId,
  };

  try {
    const response = await makeGrpcCall<Rpc_Space_InviteRevoke_Response>(
      getCurrentClient().spaceInviteRevoke,
      request
    );

    if (!response.error || response.error.code === 0) {
      console.log("Space invite revoked successfully:", response);
    } else {
      throw new Error(
        `Failed to revoke space invite: ${
          response.error.description
        } (Error code: ${response.error.code} - ${
          Rpc_Space_InviteRevoke_Response_Error_Code[response.error.code]
        })`
      );
    }
  } catch (error) {
    console.error("Failed to revoke space invite:", error);
    throw error;
  }
}

export async function callSpaceLeaveApprove(
  spaceId: string,
  identity: string
): Promise<void> {
  const request: Rpc_Space_LeaveApprove_Request = {
    spaceId: spaceId,
    identities: [identity],
  };

  try {
    const response = await makeGrpcCall<Rpc_Space_LeaveApprove_Response>(
      getCurrentClient().spaceLeaveApprove,
      request
    );
    if (!response.error || response.error.code === 0) {
      console.log("Space leave approved successfully:", response);
    } else {
      throw new Error(
        `Failed to approve space leave: ${
          response.error.description
        } (Error code: ${response.error.code} - ${
          Rpc_Space_LeaveApprove_Response_Error_Code[response.error.code]
        })`
      );
    }
  } catch (error) {
    console.error("Failed to approve space leave:", error);
    throw error;
  }
}

//USER
export async function callSpaceInviteView(
  inviteContentId: string,
  inviteFileKey: string
): Promise<{
  spaceId: string;
  spaceName: string;
  spaceIconCid: string;
  creatorName: string;
}> {
  const request: Rpc_Space_InviteView_Request = {
    inviteCid: inviteContentId,
    inviteFileKey: inviteFileKey,
  };

  try {
    const response = await makeGrpcCall<Rpc_Space_InviteView_Response>(
      getCurrentClient().spaceInviteView,
      request
    );

    if (!response.error || response.error.code === 0) {
      console.log("Space invite viewed successfully:", response);
      return {
        spaceId: response.spaceId,
        spaceName: response.spaceName,
        spaceIconCid: response.spaceIconCid,
        creatorName: response.creatorName,
      };
    } else {
      throw new Error(
        `Failed to view space invite: ${
          response.error.description
        } (Error code: ${response.error.code} - ${
          Rpc_Space_InviteView_Response_Error_Code[response.error.code]
        })`
      );
    }
  } catch (error) {
    console.error("Failed to view space invite:", error);
    throw error;
  }
}

export async function callSpaceJoin(
  spaceId: string,
  inviteContentId: string,
  inviteFileKey: string,
  networkId?: string
): Promise<void> {
  const request: Rpc_Space_Join_Request = {
    spaceId: spaceId,
    inviteCid: inviteContentId,
    inviteFileKey: inviteFileKey,
    networkId: networkId || "",
  };
  try {
    const response = await makeGrpcCall<Rpc_Space_Join_Response>(
      getCurrentClient().spaceJoin,
      request
    );

    if (!response.error || response.error.code === 0) {
      console.log("Space joined request sent successfully:", response);
    } else {
      throw new Error(
        `Failed to join space: ${response.error.description} (Error code: ${
          response.error.code
        } - ${Rpc_Space_Join_Response_Error_Code[response.error.code]})`
      );
    }
  } catch (error) {
    console.error("Failed to join space:", error);
    throw error;
  }
}

export async function callSpaceJoinCancel(spaceId: string): Promise<void> {
  const request: Rpc_Space_JoinCancel_Request = {
    spaceId: spaceId,
  };

  try {
    const response = await makeGrpcCall<Rpc_Space_JoinCancel_Response>(
      getCurrentClient().spaceJoinCancel,
      request
    );

    if (!response.error || response.error.code === 0) {
      console.log("Space join canceled successfully:", response);
    } else {
      throw new Error(
        `Failed to cancel space join: ${
          response.error.description
        } (Error code: ${response.error.code} - ${
          Rpc_Space_JoinCancel_Response_Error_Code[response.error.code]
        })`
      );
    }
  } catch (error) {
    console.error("Failed to cancel space join:", error);
    throw error;
  }
}

export async function callSpaceInviteGetCurrent(
  spaceId: string
): Promise<{ inviteContentId: string; inviteFileKey: string }> {
  const request: Rpc_Space_InviteGetCurrent_Request = {
    spaceId: spaceId,
  };

  try {
    const response = await makeGrpcCall<Rpc_Space_InviteGetCurrent_Response>(
      getCurrentClient().spaceInviteGetCurrent,
      request
    );

    if (!response.error || response.error.code === 0) {
      return {
        inviteContentId: response.inviteCid,
        inviteFileKey: response.inviteFileKey,
      };
    }
    throw new Error(
      `Failed to get current space invite: ${
        response.error.description
      } (Error code: ${response.error.code} - ${
        Rpc_Space_InviteGetCurrent_Response_Error_Code[response.error.code]
      })`
    );
  } catch (error) {
    console.error("Failed to get current space:", error);
    throw error;
  }
}

export async function checkSpaceInviteNotValid(
  spaceId: string
): Promise<boolean> {
  const request: Rpc_Space_InviteGetCurrent_Request = {
    spaceId: spaceId,
  };

  try {
    console.log(
      "Checking space invite, expecting error code 101 - invite not exists"
    );
    const response = await makeGrpcCall<Rpc_Space_InviteGetCurrent_Response>(
      getCurrentClient().spaceInviteGetCurrent,
      request,
      [101]
    );

    if (!response.error || response.error.code === 0) {
      return false; // Invite exists and is valid
    }

    // Check if error code is 101 (invite not exists)
    return response.error.code === 101;
  } catch (error: unknown) {
    // Type guard to check if error is an object with a code property
    if (typeof error === "object" && error !== null && "code" in error) {
      return (error as { code: number }).code === 101; // Invite is invalid
    }
    console.error("Failed to check space invite validity:", error);
    throw error; // Re-throw if it's a different error
  }
}

export async function callSpaceDelete(spaceId: string): Promise<void> {
  const request: Rpc_Space_Delete_Request = {
    spaceId: spaceId,
  };

  try {
    const response = await makeGrpcCall<Rpc_Space_Delete_Response>(
      getCurrentClient().spaceDelete,
      request
    );
    console.log("Space deleted successfully:", response);
  } catch (error) {
    console.error("Failed to delete space:", error);
    throw error;
  }
}
