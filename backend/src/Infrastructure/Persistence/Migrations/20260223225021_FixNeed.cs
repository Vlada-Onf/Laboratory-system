using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixNeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_needs_importance_id",
                table: "needs");

            migrationBuilder.DropForeignKey(
                name: "fk_needs_status_id",
                table: "needs");

            migrationBuilder.AlterColumn<Guid>(
                name: "status_id",
                table: "needs",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<Guid>(
                name: "importance_id",
                table: "needs",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "fk_needs_importance_id",
                table: "needs",
                column: "importance_id",
                principalTable: "need_importances",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "fk_needs_status_id",
                table: "needs",
                column: "status_id",
                principalTable: "need_statuses",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_needs_importance_id",
                table: "needs");

            migrationBuilder.DropForeignKey(
                name: "fk_needs_status_id",
                table: "needs");

            migrationBuilder.AlterColumn<Guid>(
                name: "status_id",
                table: "needs",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "importance_id",
                table: "needs",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "fk_needs_importance_id",
                table: "needs",
                column: "importance_id",
                principalTable: "need_importances",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_needs_status_id",
                table: "needs",
                column: "status_id",
                principalTable: "need_statuses",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
