package ent

func (cli *Client) WithCustomLogger(logger func(...any)) {
	cli.log = logger
}
