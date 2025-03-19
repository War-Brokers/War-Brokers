{ pkgs, ... }:

{
  packages = with pkgs; [
    nixd
    nixfmt-rfc-style

    # version of these packages must be synced with npm packages
    playwright-driver.browsers
  ];

  env = {
    PLAYWRIGHT_BROWSERS_PATH = pkgs.playwright-driver.browsers;
    PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = true;
  };

  # https://devenv.sh/tests
  enterTest = ''
    wait_for_port 5432 # WBAPI postgres DB
    wait_for_port 4000 # Mock WB
    wait_for_port 5000 # wbapi
    wait_for_port 5173 # stats site
    wait_for_port 3000 # wbtimeline

    pnpm lint
    pnpm --filter=@warbrokers/stats-site test:e2e
    pnpm --filter=@warbrokers/stats-site svelte-check
    pnpm test:unit
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
  };

  # https://github.com/cachix/devenv/blob/main/src/modules/tasks.nix
  # https://devenv.sh/tasks
  tasks = {
    "bash:reset-wbapi-db" = {
      exec = "rm -rf .devenv/state/postgres";
      before = [
        "devenv:enterShell"
        "devenv:enterTest"
      ];
    };
  };

  # https://devenv.sh/processes
  process = {
    manager.implementation = "process-compose";
    managers.process-compose.tui.enable = false;
  };
  processes = {
    # todo: https://f1bonacc1.github.io/process-compose/health wbapi health check
    dev = {
      exec = "pnpm dev";
      process-compose.depends_on.postgres.condition = "process_healthy";
    };
  };

  # https://github.com/cachix/devenv/blob/main/src/modules/services/postgres.nix
  # https://devenv.sh/supported-services/postgres
  services.postgres = {
    enable = true;
    package = pkgs.postgresql_15; # same as supabase
    listen_addresses = "127.0.0.1";
  };
}
