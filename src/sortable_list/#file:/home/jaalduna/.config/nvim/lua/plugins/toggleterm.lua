return {
	"akinsho/toggleterm.nvim",
	config = true,
	opts = {
		open_mapping = [[<c-\\>]], -- Escaped backslash
		direction = "float",
		float_options = {
			border = "double",
			width = function()
				return math.floor(vim.o.columns * 0.8)
			end,
			height = function()
				return math.floor(vim.o.lines * 0.8)
			end,
			winblend = 3,
		},
		shading_factor = 2,
		shade_terminals = true,
		shade_filetypes = {},
	},
}
