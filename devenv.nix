{ pkgs, ... }:

{
  packages = with pkgs; [
    nixd
    nixfmt-rfc-style
    commitlint
  ];

  languages = {
    # https://github.com/cachix/devenv/blob/main/src/modules/languages/javascript.nix
    # https://devenv.sh/supported-languages/javascript
    javascript = {
      enable = true;
      package = pkgs.nodejs_20; # as defined in package.json engines
      pnpm.enable = true;
      pnpm.install.enable = true;
    };

    # https://github.com/cachix/devenv/blob/main/src/modules/languages/php.nix
    # https://devenv.sh/supported-languages/php
    php = {
      enable = true;
    };
  };

  # https://github.com/cachix/devenv/blob/main/src/modules/tasks.nix
  # https://devenv.sh/tasks
  tasks = {
    "bash:husky" = {
      exec = "npm run husky";
      before = [
        "devenv:enterShell"
      ];
    };

    "bash:reset-wbapi-db" = {
      exec = "rm -rf .devenv/state/postgres";
      before = [
        "devenv:enterShell"
        "devenv:enterTest"
      ];
    };
  };

  # https://devenv.sh/processes
  processes = {
    dev = {
      exec = "pnpm dev";
      process-compose.depends_on.postgres.condition = "process_healthy";
    };

    start-wbdb = {
      exec = "cd devenv/wbdb && php -S 127.0.0.1:4000";
    };
  };

  # https://github.com/cachix/devenv/blob/main/src/modules/services/postgres.nix
  # https://devenv.sh/supported-services/postgres
  services.postgres = {
    enable = true;
    package = pkgs.postgresql_15; # same as supabase
    initialDatabases = [
      {
        name = "postgres";
        schema = ./devenv/players.sql;
      }
    ];
    listen_addresses = "127.0.0.1";
  };
}
