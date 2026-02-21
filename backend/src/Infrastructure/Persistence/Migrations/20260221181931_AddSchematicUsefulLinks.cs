using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddSchematicUsefulLinks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "additional_links",
                table: "schematics");

            migrationBuilder.AlterColumn<string>(
                name: "document_url",
                table: "schematics",
                type: "varchar(500)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "schematic_useful_link_id",
                table: "schematics",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "schematic_useful_links",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    schematic_id = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "varchar(255)", nullable: false),
                    url = table.Column<string>(type: "varchar(1000)", nullable: false),
                    created_by = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())"),
                    last_updated_by = table.Column<Guid>(type: "uuid", nullable: true),
                    last_updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_schematic_useful_links", x => x.id);
                    table.ForeignKey(
                        name: "fk_schematic_useful_links_schematics_id",
                        column: x => x.schematic_id,
                        principalTable: "schematics",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_schematic_useful_links_schematic_id",
                table: "schematic_useful_links",
                column: "schematic_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "schematic_useful_links");

            migrationBuilder.DropColumn(
                name: "schematic_useful_link_id",
                table: "schematics");

            migrationBuilder.AlterColumn<string>(
                name: "document_url",
                table: "schematics",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(500)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "additional_links",
                table: "schematics",
                type: "varchar(2000)",
                nullable: true);
        }
    }
}
