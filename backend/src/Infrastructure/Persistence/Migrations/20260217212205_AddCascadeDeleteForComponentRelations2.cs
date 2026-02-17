using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCascadeDeleteForComponentRelations2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_damaged_components_components_id",
                table: "damaged_components");

            migrationBuilder.DropForeignKey(
                name: "fk_needs_components_id",
                table: "needs");

            migrationBuilder.AddForeignKey(
                name: "fk_damaged_components_components_id",
                table: "damaged_components",
                column: "component_id",
                principalTable: "components",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_needs_components_id",
                table: "needs",
                column: "component_id",
                principalTable: "components",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_damaged_components_components_id",
                table: "damaged_components");

            migrationBuilder.DropForeignKey(
                name: "fk_needs_components_id",
                table: "needs");

            migrationBuilder.AddForeignKey(
                name: "fk_damaged_components_components_id",
                table: "damaged_components",
                column: "component_id",
                principalTable: "components",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_needs_components_id",
                table: "needs",
                column: "component_id",
                principalTable: "components",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
