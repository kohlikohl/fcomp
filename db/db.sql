-- Create syntax for TABLE 'fb_user'
CREATE TABLE `fb_user` (
  `id` bigint(50) unsigned NOT NULL auto_increment,
  `fb_uid` bigint(50) default NULL,
  `name` varchar(500) NOT NULL default '',
  `gender` varchar(100) default NULL,
  `email` varchar(500) default '',
  `is_in_comp` int(1) NOT NULL default '0',
  `source` varchar(200) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'fb_user_invited'
CREATE TABLE `fb_user_invited` (
  `fb_uid` bigint(50) unsigned NOT NULL,
  `fb_uid_invited` bigint(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;