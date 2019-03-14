import React from "react";

import Input from "./Input.js";

const AURMAN_PGP = "465022E743D71E39";

export default ({
  processor,
  hostname,
  username,
  partition_device,
  partition_efi,
  partition_root
}) => (
  <>
    <h3>SSH agent</h3>
    <ol>
      <Input name="Add socket to ENV">
        nano ~/.pam_environment
        <pre>
          <code>
            {`SSH_AUTH_SOCK DEFAULT="\${XDG_RUNTIME_DIR}/ssh-agent.socket`}
          </code>
        </pre>
      </Input>
    </ol>
  </>
);
