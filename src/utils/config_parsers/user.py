import configparser
from datetime import timedelta

from src.utils.config_parsers.config_parser import ConfigParser


def to_bool(bool_str: str) -> bool:
    return bool_str.lower() in ['true', 'yes', 'y']


class NodeConfig:
    def __init__(self, node_name: str, chain_name: str ,node_api_url: str, 
                 node_public_key: str, node_is_validator: bool, 
                 node_has_exporter: bool,monitor_node: bool, 
                 is_archive_node: bool, use_as_data_source: bool) -> None:

        self.node_name = node_name
        self.chain_name = chain_name
        self.node_api_url = node_api_url
        self.node_public_key = node_public_key
        self.node_is_validator = node_is_validator
        self.node_has_exporter = node_has_exporter
        self.monitor_node = monitor_node
        self.is_archive_node = is_archive_node
        self.use_as_data_source = use_as_data_source


class RepoConfig:
    def __init__(self, repo_name: str, repo_page: str,
                 monitor_repo: bool) -> None:
        self.repo_name = repo_name
        self.repo_page = repo_page
        self.monitor_repo = monitor_repo


class UserConfig(ConfigParser):
    # Use user_parsed.py rather than creating a new instance of this class
    def __init__(self, main_config_file_path: str,
                 nodes_config_file_path: str,
                 repos_config_file_path: str) -> None:
        super().__init__([main_config_file_path,
                          nodes_config_file_path,
                          repos_config_file_path])

        cp = configparser.ConfigParser()
        cp.read(main_config_file_path)
        cp.read(nodes_config_file_path)
        cp.read(repos_config_file_path)

        # ------------------------ Main Config

        # [general]
        self.unique_alerter_identifier = cp['general'][
            'unique_alerter_identifier']

        # [telegram_alerts]
        self.telegram_alerts_enabled = to_bool(
            cp['telegram_alerts']['enabled'])
        self.telegram_alerts_bot_token = cp['telegram_alerts']['bot_token']
        self.telegram_alerts_bot_chat_id = cp['telegram_alerts']['bot_chat_id']

        # [email_alerts]
        self.email_alerts_enabled = to_bool(cp['email_alerts']['enabled'])
        self.email_smtp = cp['email_alerts']['smtp']
        self.email_from = cp['email_alerts']['from']
        self.email_to = cp['email_alerts']['to'].split(';')

        # email_to is a semicolon-separated list of email addresses
        self.email_user = cp['email_alerts']['user']
        self.email_pass = cp['email_alerts']['pass']

        # [twilio_alerts]
        self.twilio_alerts_enabled = to_bool(cp['twilio_alerts']['enabled'])
        self.twilio_account_sid = cp['twilio_alerts']['account_sid']
        self.twilio_auth_token = cp['twilio_alerts']['auth_token']
        self.twilio_phone_number = cp['twilio_alerts']['twilio_phone_number']
        self.twilio_dial_numbers = cp['twilio_alerts'][
            'phone_numbers_to_dial'].split(';')
        # twilio_dial_numbers is a semicolon-separated list of phone numbers

        # [telegram_commands]
        self.telegram_cmds_enabled = to_bool(
            cp['telegram_commands']['enabled'])
        self.telegram_cmds_bot_token = cp['telegram_commands']['bot_token']
        self.telegram_cmds_bot_chat_id = cp['telegram_commands']['bot_chat_id']

        # [redis]
        self.redis_enabled = to_bool(cp['redis']['enabled'])
        self.redis_host = cp['redis']['host']
        self.redis_port = cp['redis']['port']
        self.redis_password = cp['redis']['password']

        # [periodic_alive_reminder]
        self.par_enabled = to_bool(cp['periodic_alive_reminder']['enabled'])
        self.par_interval_seconds = timedelta(
            seconds=int(cp['periodic_alive_reminder']['interval_seconds'])) \
            if self.par_enabled else None
        self.par_email_enabled = to_bool(
            cp['periodic_alive_reminder']['email_enabled']) \
            if self.par_enabled else None
        self.par_telegram_enabled = to_bool(
            cp['periodic_alive_reminder']['telegram_enabled']) \
            if self.par_enabled else None
        self.par_mongo_enabled = to_bool(
            cp['periodic_alive_reminder']['mongo_enabled']) \
            if self.par_enabled else None

        # [mongo]
        self.mongo_enabled = to_bool(cp['mongo']['enabled'])
        self.mongo_host = cp['mongo']['host']
        self.mongo_port = int(cp['mongo']['port']) \
            if self.mongo_enabled else None
        self.mongo_db_name = cp['mongo']['db_name']
        self.mongo_user = cp['mongo']['user']
        self.mongo_pass = cp['mongo']['pass']

        # ------------------------ Nodes Config

        # [node_...]
        sections = [cp[k] for k in cp.keys() if k.startswith('node_')]
        self.all_nodes = []
        for section in sections:
            self.all_nodes.append(
                NodeConfig(
                    section['node_name'],
                    section['chain_name'],
                    section['node_api_url'],
                    section['node_public_key'],
                    section['node_is_validator'].lower() == 'true',
                    section['node_has_exporter'].lower() == 'true',
                    section['monitor_node'].lower() == 'true',
                    section['is_archive_node'].lower() == 'true',
                    section['use_as_data_source'].lower() == 'true'
                ))

        self.filtered_nodes = [n for n in self.all_nodes
                               if n.monitor_node]

        # ------------------------ Repos Config

        # [repo_...]
        sections = [cp[k] for k in cp.keys() if k.startswith('repo_')]
        self.all_repos = []
        for section in sections:
            self.all_repos.append(
                RepoConfig(
                    section['repo_name'], section['repo_page'],
                    section['monitor_repo'].lower() == 'true'
                ))

        self.filtered_repos = [r for r in self.all_repos
                               if r.monitor_repo]
