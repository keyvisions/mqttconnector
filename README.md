# Mosquitto Connector

Logs MQQT messages to MS SQL Server

## Mosquitto CLI

`> mosquitto_sub -h localhost -t "test/message"`
`> mosquitto_pub -h localhost -t "test/message" -m "Hello, world"`

`
CREATE TABLE [dbo].[tVMCMQTT](
	[fId] [int] IDENTITY(1,1) NOT NULL,
	[fTimestamp] [datetime] NOT NULL,
	[fTopic] [varchar](256) NOT NULL,
	[fMessage] [nvarchar](max) NULL,
	[fFlags] [int] NOT NULL,
 CONSTRAINT [PK_tVMCMQTT] PRIMARY KEY CLUSTERED 
(
	[fId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[tVMCMQTT] ADD  CONSTRAINT [DF_tVMCMQTT_fTimestamp]  DEFAULT (getutcdate()) FOR [fTimestamp]
GO

ALTER TABLE [dbo].[tVMCMQTT] ADD  CONSTRAINT [DF_tVMCMQTT_fFlags]  DEFAULT ((0)) FOR [fFlags]
GO
`