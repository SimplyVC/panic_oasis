# Hashes
_hash_blockchain = "hash_bc1"

# Unique keys
_key_twilio_snooze = "tw1"
_key_alive_reminder_mute = "ar1"

# nX_<node_name>
_key_node_went_down_at = "n1"
_key_node_bonded_balance = "n2"
_key_node_is_syncing = "n3"
_key_node_no_of_peers = "n4"
_key_node_active = "n5"
_key_node_is_missing_blocks = "n6"
_key_node_time_of_last_height_check_activity = "n7"
_key_node_time_of_last_height_change = "n8"
_key_node_finalized_block_height = "n9"
_key_node_no_change_in_height_warning_sent = "n10"
_key_node_voting_power = "n11"
_key_node_consecutive_blocks_missed = "n12"
_key_node_debonding_balance = "n13"
_key_node_shares_balance = "n14"

# nmX_<monitor_name>
_key_node_monitor_alive = "nm1"
_key_node_monitor_last_height_checked = "nm2"

# sX_<node_name>
_key_system_get_process_cpu_seconds_total = "s1"
_key_system_get_process_memory_usage = "s2"
_key_system_get_virtual_memory_usage = "s3"
_key_system_get_open_file_descriptors = "s4"
_key_system_get_system_cpu_usage = "s5"
_key_system_get_system_ram_usage = "s6"
_key_system_get_system_storage_usage = "s7"

# smX_<monitor_name>
_key_system_monitor_alive = "sm1"

# ghX_<repo_name>
_key_github_releases = "gh1"


def _as_prefix(key) -> str:
    return key + "_"


class Keys:

    @staticmethod
    def get_hash_blockchain(chain_name: str) -> str:
        return _as_prefix(_hash_blockchain) + chain_name

    @staticmethod
    def get_twilio_snooze() -> str:
        return _key_twilio_snooze

    @staticmethod
    def get_alive_reminder_mute() -> str:
        return _key_alive_reminder_mute

    @staticmethod
    def get_node_went_down_at(node_name: str) -> str:
        return _as_prefix(_key_node_went_down_at) + node_name

    @staticmethod
    def get_voting_power(node_name: str) -> str:
        return _as_prefix(_key_node_voting_power) + node_name

    @staticmethod
    def get_consecutive_blocks_missed(node_name: str) -> str:
        return _as_prefix(_key_node_consecutive_blocks_missed) + node_name

    @staticmethod
    def get_node_bonded_balance(node_name: str) -> str:
        return _as_prefix(_key_node_bonded_balance) + node_name

    @staticmethod
    def get_node_debonding_balance(node_name: str) -> str:
        return _as_prefix(_key_node_debonding_balance) + node_name

    @staticmethod
    def get_node_shares_balance(node_name: str) -> str:
        return _as_prefix(_key_node_shares_balance) + node_name

    @staticmethod
    def get_node_is_syncing(node_name: str) -> str:
        return _as_prefix(_key_node_is_syncing) + node_name

    @staticmethod
    def get_node_no_of_peers(node_name: str) -> str:
        return _as_prefix(_key_node_no_of_peers) + node_name

    @staticmethod
    def get_node_active(node_name: str) -> str:
        return _as_prefix(_key_node_active) + node_name

    @staticmethod
    def get_node_is_missing_blocks(node_name: str) -> str:
        return _as_prefix(_key_node_is_missing_blocks) + node_name

    @staticmethod
    def get_node_time_of_last_height_check_activity(node_name: str) -> str:
        return _as_prefix(
            _key_node_time_of_last_height_check_activity) + node_name

    @staticmethod
    def get_node_time_of_last_height_change(node_name: str) -> str:
        return _as_prefix(_key_node_time_of_last_height_change) + node_name

    @staticmethod
    def get_node_finalized_block_height(node_name: str) -> str:
        return _as_prefix(_key_node_finalized_block_height) + node_name

    @staticmethod
    def get_node_no_change_in_height_warning_sent(node_name: str) -> str:
        return _as_prefix(
            _key_node_no_change_in_height_warning_sent) + node_name

    @staticmethod
    def get_node_monitor_alive(monitor_name: str) -> str:
        return _as_prefix(_key_node_monitor_alive) + monitor_name

    @staticmethod
    def get_node_monitor_last_height_checked(monitor_name: str) -> str:
        return _as_prefix(_key_node_monitor_last_height_checked) + monitor_name

    @staticmethod
    def get_system_get_process_cpu_seconds_total(node_name: str) -> str:
        return _as_prefix(_key_system_get_process_cpu_seconds_total) + node_name

    @staticmethod
    def get_system_get_process_memory_usage(node_name: str) -> str:
        return _as_prefix(_key_system_get_process_memory_usage) + node_name

    @staticmethod
    def get_system_get_virtual_memory_usage(node_name: str) -> str:
        return _as_prefix(_key_system_get_virtual_memory_usage) + node_name

    @staticmethod
    def get_system_get_open_file_descriptors(node_name: str) -> str:
        return _as_prefix(_key_system_get_open_file_descriptors) + node_name

    @staticmethod
    def get_system_get_system_cpu_usage(node_name: str) -> str:
        return _as_prefix(_key_system_get_system_cpu_usage) + node_name

    @staticmethod
    def get_system_get_system_ram_usage(node_name: str) -> str:
        return _as_prefix(_key_system_get_system_ram_usage) + node_name

    @staticmethod
    def get_system_get_system_storage_usage(node_name: str) -> str:
        return _as_prefix(_key_system_get_system_storage_usage) + node_name

    @staticmethod
    def get_system_monitor_alive(monitor_name: str) -> str:
        return _as_prefix(_key_system_monitor_alive) + monitor_name

    @staticmethod
    def get_github_releases(repo_name: str) -> str:
        return _as_prefix(_key_github_releases) + repo_name
