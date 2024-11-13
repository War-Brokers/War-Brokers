{ pkgs, ... }:

{
  packages = with pkgs; [
    nixd
    nixfmt-rfc-style
    commitlint

    # version of this package must be synced with npm package or else playwright
    # will try to use browsers versions that aren't installed!
    playwright-driver.browsers
  ];

  env = {
    PLAYWRIGHT_BROWSERS_PATH = pkgs.playwright-driver.browsers;
    PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = true;
  };

  # https://devenv.sh/tests
  enterTest = ''
    pnpm lint
    pnpm test:e2e
    pnpm test:unit
    cd apps/stats-site && pnpm svelte-check
  '';

  languages = {
    # https://github.com/cachix/devenv/blob/main/src/modules/languages/javascript.nix
    # https://devenv.sh/supported-languages/javascript
    javascript = {
      # sync package.json>engines versions on devenv update

      enable = true;
      package = pkgs.nodejs_20;
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
