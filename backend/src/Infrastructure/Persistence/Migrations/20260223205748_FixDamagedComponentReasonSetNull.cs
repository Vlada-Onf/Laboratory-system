using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixDamagedComponentReasonSetNull : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_damaged_components_reasons_id",
                table: "damaged_components");

            migrationBuilder.AddForeignKey(
                name: "fk_damaged_components_reasons_id",
                table: "damaged_components",
                column: "reason_id",
                principalTable: "damaged_component_reasons",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_damaged_components_reasons_id",
                table: "damaged_components");

            migrationBuilder.AddForeignKey(
                name: "fk_damaged_components_reasons_id",
                table: "damaged_components",
                column: "reason_id",
                principalTable: "damaged_component_reasons",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
